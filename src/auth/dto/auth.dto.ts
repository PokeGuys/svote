import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsValidHKID } from '../../app/rule/is-valid-hkid';

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  @Validate(IsValidHKID)
  @ApiProperty({
    description: 'HKID number',
    example: 'U5849818',
    type: () => String,
  })
  readonly hkid: string;
}
