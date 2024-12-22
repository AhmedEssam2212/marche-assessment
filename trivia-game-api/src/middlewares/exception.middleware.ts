import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions/http-exception";

export const exceptionMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode,
    error: error.error,
  });
};
