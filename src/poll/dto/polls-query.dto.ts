import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class PollsQueryDto {
  @ApiPropertyOptional({
    description: 'Query cursor for poll list pagination',
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => value && parseInt(value, 10))
  cursor?: number;
}
