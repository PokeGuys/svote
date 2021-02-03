import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigFactoryModule } from 'src/config/config-factory.module';
import { RedisModule } from '../app/redis/redis.module';
import { RedisConfigService } from '../config/redis-config.service';
import { PollFormatter } from './formatter/poll.formatter';
import { PollOption } from './poll-options.entity';
import { PollController } from './poll.controller';
import { Poll } from './poll.entity';
import { PollService } from './poll.service';
import { Vote } from './vote.entity';

@Module({
  imports: [
    ConfigFactoryModule,
    TypeOrmModule.forFeature([Vote, Poll, PollOption]),
    RedisModule.registerAsync({
      useExisting: RedisConfigService,
      imports: [ConfigModule],
    }),
  ],
  providers: [PollService, PollFormatter],
  controllers: [PollController],
  exports: [PollService, PollFormatter],
})
export class PollModule {}
