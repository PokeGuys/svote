import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigFactoryModule } from './config/config-factory.module';
import { TypeOrmConfigService } from './config/typeorm-config.service';
import { PollModule } from './poll/poll.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigFactoryModule],
      useExisting: TypeOrmConfigService,
    }),
    AuthModule,
    PollModule,
  ],
})
export class ApplicationModule {}
