import { Provider } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT, REDIS_OPTIONS } from './redis.constant';
import { RedisModuleOptions } from './redis.interface';

export function createRedisClient(): Provider {
  return {
    provide: REDIS_CLIENT,
    useFactory: (options: RedisModuleOptions) => {
      const { url, ...opt } = options;
      return url ? new Redis(url) : new Redis(opt);
    },
    inject: [REDIS_OPTIONS],
  };
}
