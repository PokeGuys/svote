import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import IORedis from 'ioredis';
import { In, Repository } from 'typeorm';
import { PaginationMetaDto } from '../app/pagination-meta.dto';
import { PaginationDto } from '../app/pagination.dto';
import { REDIS_CLIENT } from '../app/redis/redis.constant';
import { PollAlreadyClosedException } from './exception/poll-already-closed.exception';
import { PollAlreadyVotedException } from './exception/poll-already-voted.exception';
import { PollNotFoundException } from './exception/poll-not-found.exception';
import { PollOption } from './poll-options.entity';
import { PollCacheBuilder } from './poll.cache';
import { POLL_PAGE_LIMIT } from './poll.constant';
import { Poll } from './poll.entity';
import { Vote } from './vote.entity';

@Injectable()
export class PollService {
  constructor(
    @InjectRepository(Poll)
    private readonly pollRepo: Repository<Poll>,
    @InjectRepository(PollOption)
    private readonly pollOptionRepo: Repository<PollOption>,
    @InjectRepository(Vote)
    private readonly voteRepo: Repository<Vote>,
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

  public async getPolls(page: number, userId: string): Promise<PaginationDto<Poll>> {
    // TODO: Apply caching.
    // Filter-out scheduled poll.
    const limit = POLL_PAGE_LIMIT;
    const builder = this.pollRepo
      .createQueryBuilder('poll')
      .where('CURRENT_DATE >= poll.startAt')
      .orderBy(
        `poll.isActive DESC, CASE WHEN poll.isActive THEN poll.count END DESC, CASE WHEN NOT poll.isActive THEN poll.endAt END`,
        'DESC',
      );
    const totalBuilder = builder.clone();
    const [{ entities: items }, total] = await Promise.all([
      builder
        .leftJoinAndMapOne('poll.vote', Vote, 'vote', 'poll.pollId = vote.pollId AND vote.voterHash = :userId', {
          userId,
        })
        .limit(limit)
        .offset((page - 1) * limit)
        .getRawAndEntities(),
      totalBuilder.getCount(),
    ]);
    const pollKeyById = items.reduce((acc, item) => ({ ...acc, [item.pollId]: item }), {} as any);
    const pollIds = items.map((item) => item.pollId);
    const options = await this.getOptionsByIds(pollIds);
    options.forEach((option) => {
      if (pollKeyById[option.pollId].options === undefined) {
        pollKeyById[option.pollId].options = [];
      }
      pollKeyById[option.pollId].options.push(option);
    });
    return this.createPaginationObject(items, total, page, limit);
  }

  public async getPoll(pollId: string, userId: string): Promise<Poll> {
    const poll = await this.pollRepo
      .createQueryBuilder('poll')
      .where('poll.pollId = :pollId', { pollId })
      .innerJoinAndMapMany('poll.options', PollOption, 'options', 'poll.pollId = options.pollId')
      .leftJoinAndMapOne('poll.vote', Vote, 'vote', 'poll.pollId = vote.pollId AND vote.voterHash = :userId', {
        userId,
      })
      .getOne();
    if (poll === undefined) {
      throw new PollNotFoundException();
    }
    return poll;
  }

  public async vote(optionId: string, hkid: string): Promise<Vote> {
    const option = await this.findOption(optionId);
    if (!option.poll.isActive) {
      throw new PollNotFoundException();
    }
    if (option.poll.isEnded) {
      throw new PollAlreadyClosedException();
    }
    const queueKey = PollCacheBuilder.updatePollVoteQueueCacheKey();
    const cacheKey = PollCacheBuilder.newVoteCacheKey(option.pollId);
    const ttl = await this.cache.ttl(cacheKey);
    const isVoted = await this.cache.sismember(cacheKey, hkid);
    if (isVoted) {
      throw new PollAlreadyVotedException();
    }
    const pipeline = this.cache.pipeline().sadd(cacheKey, hkid).sadd(queueKey, option.pollId);
    if (ttl === -1) {
      const expiryInSec = dayjs(option.poll.endAt).add(1, 'month').diff(dayjs(), 'seconds');
      pipeline.expire(cacheKey, expiryInSec);
    }
    await pipeline.exec();
    await this.pollOptionRepo.increment({ optionId }, 'count', 1);
    return this.storeVoteResult(option.pollId, optionId, hkid);
  }

  protected createPaginationObject<T>(
    items: T[],
    totalItems: number,
    currentPage: number,
    limit: number,
  ): PaginationDto<T> {
    const totalPages = Math.ceil(totalItems / limit);
    const meta: PaginationMetaDto = {
      totalItems: totalItems,
      itemCount: items.length,
      itemsPerPage: limit,

      totalPages: totalPages,
      currentPage: currentPage,
    };

    return new PaginationDto(items, meta);
  }

  protected async storeVoteResult(pollId: string, optionId: string, voterHash: string): Promise<Vote> {
    const voteResult = new Vote();
    voteResult.pollId = pollId;
    voteResult.optionId = optionId;
    voteResult.voterHash = voterHash;
    await this.voteRepo.save(voteResult);
    return voteResult;
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
}
