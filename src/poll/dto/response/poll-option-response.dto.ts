import { ApiProperty } from '@nestjs/swagger';
import { PollOption } from 'src/poll/poll-options.entity';
export class PollOptionResponseDto {
  @ApiProperty()
  optionId: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  count: number;

  constructor(option: PollOption) {
    this.optionId = option.optionId;
    this.text = option.text;
    this.count = option.count;
  }
}
