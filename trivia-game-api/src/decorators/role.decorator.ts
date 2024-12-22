import { Request, Response, NextFunction } from "express";
import { ForbiddenException } from "../exceptions/forbidden-exception";
import { ErrorCode } from "../enums/error-code.enum";

export const RoleGuard = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !roles.includes(user.role)) {
      throw new ForbiddenException(
        "Forbidden: You do not have the required role.",
        ErrorCode.FORBIDDEN_EXCEPTION
      );
    }

    next();
  };
};
