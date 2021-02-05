import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

export interface RefreshTokenPayload {
  uid: string;
  sub: string;
}

@Injectable()
export class AuthService {
  constructor(public readonly jwtService: JwtService, public readonly configService: ConfigService) {}

  public async createToken(hkid: string): Promise<string> {
    return this.generateToken(this.maskHKID(hkid));
  }
  public async createRefreshToken(hkid: string): Promise<string> {
    return this.generateRefreshToken(this.maskHKID(hkid));
  }

  public async generateToken(uid: string): Promise<string> {
    return this.jwtService.signAsync({ uid }, { subject: uid });
  }

  public async generateRefreshToken(uid: string): Promise<string> {
    const expiresIn = this.configService.get('JWT_REFRESH_EXPIRATION_TIME');
    return this.jwtService.signAsync({ uid }, { expiresIn, subject: uid });
  }

  public async createAccessTokenFromRefreshToken(refresh: string): Promise<{ token: string; refreshToken: string }> {
    const uid = await this.resolveRefreshToken(refresh);
    const [token, refreshToken] = await Promise.all([this.generateToken(uid), this.generateRefreshToken(uid)]);
    return {
      token,
      refreshToken,
    };
  }

  public async resolveRefreshToken(encoded: string) {
    const payload = await this.decodeRefreshToken(encoded);
    return payload.uid;
  }

  private async decodeRefreshToken(token: string): Promise<RefreshTokenPayload> {
    try {
      return this.jwtService.verifyAsync(token);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  private maskHKID(hkid: string) {
    const key = this.configService.get('APP_KEY');
    return crypto.createHmac('sha256', key).update(hkid).digest('hex');
  }
}
