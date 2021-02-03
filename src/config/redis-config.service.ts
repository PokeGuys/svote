import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisModuleOptions, RedisOptionsFactory } from '../app/redis/redis.interface';

@Injectable()
export class RedisConfigService implements RedisOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createRedisOptions(): RedisModuleOptions {
    return {
      name: 'cache',
      host: this.config.get<string>('REDIS_HOST'),
      port: this.config.get<number>('REDIS_PORT'),
      db: 0,
    };
  }
}
