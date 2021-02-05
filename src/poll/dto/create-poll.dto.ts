import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  Validate,
} from 'class-validator';
import { IsAfterDate } from '../../app/rule/is-after-date';
import { IsAfterOrToday } from '../../app/rule/is-after-or-today';

export class CreatePollDto {
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    description: 'Poll title',
    example: 'Who is the best NBA player in history',
    type: 'string',
  })
  readonly title: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Validate(IsAfterOrToday)
  @ApiProperty({
    description: 'Poll start date',
    example: 1613253120,
    type: 'number',
  })
  readonly startAt: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Validate(IsAfterDate, ['startAt'])
  @ApiProperty({
    description: 'Poll end date',
    example: 1614253120,
    type: 'number',
  })
  readonly endAt: number;

  @IsArray()
  @IsString({ each: true })
  @MaxLength(25, { each: true })
  @IsNotEmpty()
  @ArrayMinSize(2)
  @ArrayMaxSize(20)
  @ApiProperty({
    description: 'Poll options',
    example: ['Michael Jordan', 'Kobe Bryant', 'Leborn James', 'Stephen Curry'],
    type: 'array',
    minItems: 2,
    maxItems: 20,
    items: {
      type: 'string',
    },
  })
  readonly options: string[];
}
