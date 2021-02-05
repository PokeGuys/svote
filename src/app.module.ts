import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigFactoryModule } from './config/config-factory.module';
import { TypeOrmConfigService } from './config/typeorm-config.service';
import { PollModule } from './poll/poll.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigFactoryModule],
      useExisting: TypeOrmConfigService,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    PollModule,
    TasksModule,
  ],
})
export class ApplicationModule {}
