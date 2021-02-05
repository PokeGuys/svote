import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import IORedis from 'ioredis';
import { getConnection, Repository } from 'typeorm';
import { REDIS_CLIENT } from '../app/redis/redis.constant';
import { PollCacheBuilder } from '../poll/poll.cache';
import { Poll } from './../poll/poll.entity';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(Poll) private readonly pollRepo: Repository<Poll>,
    @Inject(REDIS_CLIENT)
    private readonly cache: IORedis.Redis,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  public async triggerUpdatePollCachedVotes() {
    this.logger.debug('CRON: update poll vote count by redis');
    // 1. Get updated poll id from queue cache key.
    const queueKey = PollCacheBuilder.updatePollVoteQueueCacheKey();
    const [[, pollIds]] = await this.cache.multi().smembers(queueKey).del(queueKey).exec();
    // 2. Calculate unique voters.
    // Early exit when there is no poll being updated.
    if (pollIds.length === 0) {
      return;
    }
    const pipeline = this.cache.pipeline();
    for (const id of pollIds) {
      pipeline.scard(PollCacheBuilder.newVoteCacheKey(id));
    }
    const results = await pipeline.exec();
    const votes: number[] = [];

    // FIXME: Constructing pg batch update query
    // 3. Perform DB update.
    const tempValues = results
      .map(([, vote], idx) => {
        votes.push(vote);
        return `($${idx + 1}::uuid, $${results.length + 1 + idx}::int)`;
      })
      .join(',');
    getConnection().query(
      `UPDATE "polls" SET "count"="tmp"."votes"
      FROM (VALUES ${tempValues}) AS "tmp" ("pollId", "votes")
      WHERE "polls"."pollId" = "tmp"."pollId"
    `,
      [...pollIds, ...votes],
    );
  }

  @Cron(CronExpression.EVERY_2_HOURS)
  public async triggerUpdatePollAggregateVotes() {
    this.logger.debug('CRON: update poll vote count by query aggregation');
    await getConnection().query(
      `UPDATE "polls" SET "count" = "sq"."sumVotes"
        FROM (
            SELECT "poll_options"."pollId", SUM(poll_options.count) AS "sumVotes"
            FROM "poll_options"
            GROUP BY "poll_options"."pollId"
        ) AS sq
        WHERE "polls"."isActive" and "polls"."pollId" = "sq"."pollId"`,
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  public async triggerUpdateInactivePoll() {
    // Mark active poll as ended every day at mid-night.
    // Mark future poll as active.
    await this.pollRepo
      .createQueryBuilder()
      .update({ isActive: false, isEnded: true })
      .where('isActive')
      .andWhere('CURRENT_DATE > endAt')
      .execute();
    await this.pollRepo
      .createQueryBuilder()
      .update({ isActive: true })
      .where('not isEnded')
      .andWhere('not isActive')
      .execute();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  public async houseKeepingEndedPollResult() {
    await getConnection().query(`DELETE FROM "votes"
      USING "polls"
      WHERE "isEnded"
      AND AGE("endAt") > INTERVAL '1 month'
      AND "polls"."pollId" = "votes"."pollId"`);
  }
}
