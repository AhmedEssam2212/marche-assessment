import { ErrorCode } from "../enums/error-code.enum";

export class HttpException extends Error {
  message: string;
  errorCode: ErrorCode;
  statusCode: number;
  error: any;
  constructor(
    message: string,
    errorCode: ErrorCode,
    statusCode: number,
    error: any
  ) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.error = error;
  }
}
