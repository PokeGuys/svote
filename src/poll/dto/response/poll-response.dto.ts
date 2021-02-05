import { ApiProperty } from '@nestjs/swagger';
import dayjs from 'dayjs';
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

  @ApiProperty({
    type: [PollOptionResponseDto],
  })
  options: PollOptionResponseDto[];

  @ApiProperty()
  voted: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isEnded: boolean;

  constructor(poll: Poll) {
    this.id = poll.pollId;
    this.title = poll.title;
    this.startAt = dayjs(poll.startAt).unix();
    this.endAt = dayjs(poll.endAt).unix();
    this.voted = poll.vote !== undefined && poll.vote !== null;
    this.isActive = poll.isActive;
    this.isEnded = poll.isEnded;
    this.options = poll.options.map((option) => new PollOptionResponseDto(poll, option));
  }
}
