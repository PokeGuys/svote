import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  constructor(public readonly errorCode: string, public readonly errorPayload: any = null) {
    super(
      HttpException.createBody('Input data validation failed.', errorPayload, HttpStatus.UNPROCESSABLE_ENTITY),
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
