import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtConfigService } from './jwt-config.service';
import { RedisConfigService } from './redis-config.service';
import { TypeOrmConfigService } from './typeorm-config.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [RedisConfigService, TypeOrmConfigService, JwtConfigService],
  exports: [RedisConfigService, TypeOrmConfigService, JwtConfigService],
})
export class ConfigFactoryModule {}
