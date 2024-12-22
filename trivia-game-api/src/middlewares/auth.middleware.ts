import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnAuthorizedException } from "../exceptions/un-authorized-exception";
import { ErrorCode } from "../enums/error-code.enum";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      next(
        new UnAuthorizedException(
          "Authorization header is missing",
          ErrorCode.UN_AUTHORIZED_EXCEPTION
        )
      );
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      next(
        new UnAuthorizedException(
          "Token is missing",
          ErrorCode.UN_AUTHORIZED_EXCEPTION
        )
      );
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;

    next();
  } catch (err) {
    next(
      new UnAuthorizedException(
        "Invalid or expired token",
        ErrorCode.UN_AUTHORIZED_EXCEPTION
      )
    );
  }
};
