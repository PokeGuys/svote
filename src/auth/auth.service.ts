import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(public readonly jwtService: JwtService, public readonly configService: ConfigService) {}

  async createToken(hkid: string): Promise<string> {
    return this.jwtService.signAsync({ uid: this.maskHKID(hkid) });
  }

  private maskHKID(hkid: string) {
    const key = this.configService.get('APP_KEY');
    return crypto.createHmac('sha256', key).update(hkid).digest('hex');
  }
}
