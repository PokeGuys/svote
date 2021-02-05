import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  @IsJWT()
  @ApiProperty({
    description: 'JWT refresh token',
    type: () => String,
  })
  readonly refreshToken: string;
}
