import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '../../../app/pagination-meta.dto';
import { PollResponseDto } from './poll-response.dto';

export class PollListResponseDto {
  @ApiProperty()
  items: PollResponseDto[];

  @ApiProperty()
  meta: PaginationMetaDto;
}
