import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisConfigService } from './redis-config.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [RedisConfigService],
  exports: [RedisConfigService],
})
export class ConfigFactoryModule {}
