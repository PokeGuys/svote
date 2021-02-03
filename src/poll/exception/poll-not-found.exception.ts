import { HttpStatus } from '@nestjs/common';
import { ApiException } from '../../app/exception/api.exception';

export class PollNotFoundException extends ApiException {
  constructor() {
    super('poll-notfound', HttpStatus.NOT_FOUND);
  }
}
