import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PollsQueryDto {
  @ApiPropertyOptional({
    description: 'Page number for poll list pagination',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => value && parseInt(value, 10))
  page?: number;
}
