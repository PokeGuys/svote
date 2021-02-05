import { ModuleMetadata, Type } from '@nestjs/common';
import { RedisOptions } from 'ioredis';

export interface RedisModuleOptions extends RedisOptions {
  url?: string;
}

export interface RedisOptionsFactory {
  createRedisOptions(): Promise<RedisModuleOptions> | RedisModuleOptions;
}

export interface RedisAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useExisting?: Type<RedisOptionsFactory>;
  useClass?: Type<RedisOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<RedisModuleOptions> | RedisOptionsFactory;
  inject?: any[];
}
