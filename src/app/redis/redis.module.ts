import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { REDIS_CLIENT, REDIS_OPTIONS } from './redis.constant';
import { RedisAsyncOptions, RedisModuleOptions, RedisOptionsFactory } from './redis.interface';
import { createRedisClient } from './redis.provider';

@Module({
  providers: [createRedisClient()],
  exports: [REDIS_CLIENT],
})
export class RedisModule {
  static register(options: RedisModuleOptions): DynamicModule {
    return {
      module: RedisModule,
      providers: [{ provide: REDIS_OPTIONS, useValue: options }],
    };
  }

  static registerAsync(options: RedisAsyncOptions): DynamicModule {
    return {
      module: RedisModule,
      imports: options.imports,
      providers: [...this.createAsyncProviders(options)],
    };
  }

  private static createAsyncProviders(options: RedisAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<RedisOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        useClass,
        provide: useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(options: RedisAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: REDIS_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: REDIS_OPTIONS,
      useFactory: async (optionsFactory: RedisOptionsFactory) => optionsFactory.createRedisOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
