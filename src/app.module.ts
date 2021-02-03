import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollModule } from './poll/poll.module';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forRoot(), PollModule],
})
export class ApplicationModule {}
