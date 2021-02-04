import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import IORedis from 'ioredis';
import { paginateRaw, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
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
    const startDate = dayjs.unix(startAt).startOf('day');
    const poll = new Poll();
    poll.title = title;
    poll.creatorId = hkid;
    poll.isActive = startDate.isSame(dayjs().startOf('day'));
    poll.startAt = startDate.toDate();
    poll.endAt = dayjs.unix(endAt).toDate();
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
    // Filter-out scheduled poll.
    const builder = this.pollRepo
      .createQueryBuilder('poll')
      .innerJoinAndSelect('poll.options', 'pollOption')
      .where('CURRENT_DATE >= poll.startAt')
      .orderBy(
        `poll.isActive DESC, CASE WHEN poll.isActive THEN poll.count END DESC, CASE WHEN NOT poll.isActive THEN poll.endAt END`,
        'DESC',
      );
    return paginateRaw(builder, {
      page,
      limit: POLL_PAGE_LIMIT,
    });
  }

  public async vote(optionId: string, hkid: string): Promise<void> {
    const option = await this.findOption(optionId);
    if (!option.poll.isActive) {
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

  protected async findOption(optionId: string): Promise<PollOption> {
    const option = await this.pollOptionRepo.findOne({
      optionId,
    });
    if (option === undefined) {
      throw new PollNotFoundException();
    }
    return option;
  }

  private newVoteCacheKey(pollId: string): string {
    return `nestjs:svote:poll:${pollId}:votes`;
  }
}
