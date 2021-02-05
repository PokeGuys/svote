import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '../app/redis/redis.module';
import { RedisConfigService } from '../config/redis-config.service';
import { Poll } from '../poll/poll.entity';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Poll]),
    RedisModule.registerAsync({
      useExisting: RedisConfigService,
      imports: [ConfigModule],
    }),
  ],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
