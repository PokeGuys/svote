import { ApiProperty } from '@nestjs/swagger';
import * as dayjs from 'dayjs';
import { Poll } from '../../poll.entity';
import { PollOptionResponseDto } from './poll-option-response.dto';

export class PollResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  startAt: number;

  @ApiProperty()
  endAt: number;

  @ApiProperty()
  options: PollOptionResponseDto[];

  constructor(poll: Poll) {
    this.id = poll.pollId;
    this.title = poll.title;
    this.startAt = dayjs(poll.startAt).unix();
    this.endAt = dayjs(poll.endAt).unix();
    this.options = poll.options.map((option) => new PollOptionResponseDto(option, poll.isEnded));
  }
}
