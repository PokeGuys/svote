import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import IORedis from 'ioredis';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { In, Repository } from 'typeorm';
import { REDIS_CLIENT } from '../app/redis/redis.constant';
import { PollAlreadyClosedException } from './exception/poll-already-closed.exception';
import { PollAlreadyVotedException } from './exception/poll-already-voted.exception';
import { PollNotFoundException } from './exception/poll-not-found.exception';
import { PollOption } from './poll-options.entity';
import { POLL_PAGE_LIMIT } from './poll.constant';
import { Poll } from './poll.entity';

@Injectable()
export class PollService {
  constructor(
    @InjectRepository(Poll)
    private readonly pollRepo: Repository<Poll>,
    @InjectRepository(PollOption)
    private readonly pollOptionRepo: Repository<PollOption>,
    @Inject(REDIS_CLIENT)
    private readonly cache: IORedis.Redis,
  ) {}

  public async createPoll(
    hkid: string,
    title: string,
    options: string[],
    startAt: number,
    endAt: number,
  ): Promise<Poll> {
    const today = dayjs().startOf('day');
    const startDate = dayjs.unix(startAt).startOf('day');
    const endDate = dayjs.unix(endAt).startOf('day');
    const poll = new Poll();
    poll.title = title;
    poll.creatorId = hkid;
    poll.isActive = startDate.diff(today) <= 0 && endDate.diff(today) > 0;
    poll.isEnded = false;
    poll.startAt = startDate.toDate();
    poll.endAt = endDate.toDate();
    await this.pollRepo.save(poll);
    poll.options = options.map((optionDescription) => {
      const option = new PollOption();
      option.text = optionDescription;
      option.poll = poll;
      return option;
    });
    await this.pollOptionRepo.save(poll.options);

    return poll;
  }

  public async getPolls(page: number): Promise<Pagination<Poll>> {
    // TODO: Apply caching.
    // Filter-out scheduled poll.
    const builder = this.pollRepo
      .createQueryBuilder('poll')
      .where('CURRENT_DATE >= poll.startAt')
      .orderBy(
        `poll.isActive DESC, CASE WHEN poll.isActive THEN poll.count END DESC, CASE WHEN NOT poll.isActive THEN poll.endAt END`,
        'DESC',
      );
    const { items, meta } = await paginate(builder, {
      page,
      limit: POLL_PAGE_LIMIT,
    });
    const pollKeyById = items.reduce((acc, item) => ({ ...acc, [item.pollId]: item }), {} as any);
    const pollIds = items.map((item) => item.pollId);
    const options = await this.getOptionsByIds(pollIds);
    options.forEach((option) => {
      if (pollKeyById[option.pollId].options === undefined) {
        pollKeyById[option.pollId].options = [];
      }
      pollKeyById[option.pollId].options.push(option);
    });
    return new Pagination(items, meta);
  }

  public async vote(optionId: string, hkid: string): Promise<void> {
    const option = await this.findOption(optionId);
    if (!option.poll.isActive) {
      throw new PollNotFoundException();
    }
    if (option.poll.isEnded) {
      throw new PollAlreadyClosedException();
    }
    const cacheKey = this.newVoteCacheKey(option.pollId);
    const isVoted = await this.cache.sismember(cacheKey, hkid);
    if (isVoted) {
      throw new PollAlreadyVotedException();
    }
    await this.cache.sadd(cacheKey, hkid);
    await this.pollOptionRepo.increment({ optionId }, 'count', 1);
  }

  protected async getOptionsByIds(pollIds: string[]): Promise<PollOption[]> {
    return this.pollOptionRepo.find({
      pollId: In(pollIds),
    });
  }

  protected async findOption(optionId: string): Promise<PollOption> {
    const option = await this.pollOptionRepo.findOne(
      {
        optionId,
      },
      { relations: ['poll'] },
    );
    if (option === undefined) {
      throw new PollNotFoundException();
    }
    return option;
  }

  private newVoteCacheKey(pollId: string): string {
    return `nestjs:svote:poll:${pollId}:votes`;
  }
}
