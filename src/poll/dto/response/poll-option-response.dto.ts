import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PollOption } from '../../poll-options.entity';
import { Poll } from '../../poll.entity';

export class PollOptionResponseDto {
  @ApiProperty()
  optionId: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  count: number;

  @ApiPropertyOptional()
  voted?: boolean;

  constructor(poll: Poll, option: PollOption) {
    const isVoted = poll.vote !== undefined && poll.vote !== null;
    const displayCount = poll.isEnded || isVoted;
    this.optionId = option.optionId;
    this.text = option.text;
    this.count = displayCount ? option.count : 0;
    if (isVoted && poll.vote!.optionId === option.optionId) {
      this.voted = true;
    }
  }
}
