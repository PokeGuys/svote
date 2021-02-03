import { HttpStatus } from '@nestjs/common';
import { ApiException } from '../../app/exception/api.exception';

export class PollAlreadyVotedException extends ApiException {
  constructor() {
    super('voted-poll', HttpStatus.BAD_REQUEST);
  }
}
