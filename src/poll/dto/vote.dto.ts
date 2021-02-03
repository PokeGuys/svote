import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Validate } from 'class-validator';
import { IsValidHKID } from '../../app/rule/is-valid-hkid';

export class VoteDto {
  @IsNotEmpty()
  @Validate(IsValidHKID)
  @ApiProperty({
    description: 'HKID number',
    example: 'U5849818',
    type: () => String,
  })
  readonly hkid: string;
}
