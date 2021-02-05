import { HttpStatus } from '@nestjs/common';
import { ApiException } from '../../app/exception/api.exception';

export class PollAlreadyClosedException extends ApiException {
  constructor() {
    super('closed-poll', HttpStatus.BAD_REQUEST);
  }
}
