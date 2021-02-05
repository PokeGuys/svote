import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from './pagination-meta.dto';

export class PaginationDto<PaginationObject> {
  @ApiProperty()
  items: PaginationObject[];

  @ApiProperty()
  meta: PaginationMetaDto;

  constructor(items: PaginationObject[], meta: PaginationMetaDto) {
    this.items = items;
    this.meta = meta;
  }
}
