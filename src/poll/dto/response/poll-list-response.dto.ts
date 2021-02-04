import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../app/pagination.dto';
import { PollResponseDto } from './poll-response.dto';

export class PollListResponseDto {
  @ApiProperty()
  items: PollResponseDto[];

  @ApiProperty()
  meta: PaginationDto;
}
