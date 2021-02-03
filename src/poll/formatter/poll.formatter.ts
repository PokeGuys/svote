import { BaseFormatter } from 'src/app/base-formatter';
import { PollResponseDto } from '../dto/response/poll-response.dto';
import { Poll } from './../poll.entity';

export class PollFormatter implements BaseFormatter<PollResponseDto> {
  toJson(model: Poll): PollResponseDto {
    return new PollResponseDto(model);
  }
}
