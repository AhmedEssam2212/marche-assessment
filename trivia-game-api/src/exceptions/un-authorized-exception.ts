import { ErrorCode } from "../enums/error-code.enum";
import { HttpException } from "./http-exception";

export class UnAuthorizedException extends HttpException {
  constructor(message: string, errorCode: ErrorCode, error?: any) {
    super(message, errorCode, 401, error);
  }
}
