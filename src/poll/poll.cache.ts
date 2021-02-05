export class PollCacheBuilder {
  public static updatePollVoteQueueCacheKey = (): string => `nestjs:svote:polls:votes:queue`;
  public static newVoteCacheKey = (pollId: string): string => `nestjs:svote:poll:${pollId}:votes`;
}
