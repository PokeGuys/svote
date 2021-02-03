import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisConfigService } from './redis-config.service';
import { TypeOrmConfigService } from './typeorm-config.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [RedisConfigService, TypeOrmConfigService],
  exports: [RedisConfigService, TypeOrmConfigService],
})
export class ConfigFactoryModule {}
