import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.config.get('JWT_SECRET_KEY'),
      signOptions: {
        expiresIn: this.config.get('JWT_EXPIRATION_TIME'),
      },
    };
  }
}
