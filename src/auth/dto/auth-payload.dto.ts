import { ApiProperty } from '@nestjs/swagger';

export class AuthPayloadDto {
  @ApiProperty({
    description: 'JWT token',
  })
  token: string;

  constructor(token: string) {
    this.token = token;
  }
}
