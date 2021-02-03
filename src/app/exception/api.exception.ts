import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiException extends HttpException {
  constructor(
    public readonly errorMessage: string,
    public readonly statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    public readonly data: any = null,
  ) {
    super(HttpException.createBody(errorMessage, data, statusCode), statusCode);
  }
}
