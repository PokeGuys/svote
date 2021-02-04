import { ApiProperty } from '@nestjs/swagger';
import { PollOption } from '../../poll-options.entity';

export class PollOptionResponseDto {
  @ApiProperty()
  optionId: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  count: number;

  constructor(option: PollOption, displayCount?: boolean) {
    this.optionId = option.optionId;
    this.text = option.text;
    this.count = displayCount ? option.count : 0;
  }
}
