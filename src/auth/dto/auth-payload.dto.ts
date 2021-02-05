import { ApiProperty } from '@nestjs/swagger';

export class AuthPayloadDto {
  @ApiProperty({
    description: 'JWT token (default: expired in an hour)',
  })
  token: string;

  @ApiProperty({
    description: 'JWT refresh token (default: expired in 7days)',
  })
  refreshToken: string;

  constructor(token: string, refreshToken: string) {
    this.token = token;
    this.refreshToken = refreshToken;
  }
}
