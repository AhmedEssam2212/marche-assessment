import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { RegisterDto } from "../dtos/user/auth/register.dto";
import { BadRequestException } from "../exceptions/bad-request-exception";
import { ErrorCode } from "../enums/error-code.enum";
import { LoginDto } from "../dtos/user/auth/login.dto";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  public async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const registerDto = plainToInstance(RegisterDto, req.body);

      const errors = await validate(registerDto);
      if (errors.length > 0) {
        return next(
          new BadRequestException(
            "Validation failed",
            ErrorCode.VALIDATION_FAILED,
            errors.map((err) => ({
              property: err.property,
              constraints: err.constraints,
            }))
          )
        );
      }

      const message = await this.authService.register(registerDto, next);
      res.json({ message });
    } catch (error) {
      next(error);
    }
  }

  public async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const loginDto = plainToInstance(LoginDto, req.body);

      const errors = await validate(loginDto);
      if (errors.length > 0) {
        return next(
          new BadRequestException(
            "Validation failed",
            ErrorCode.VALIDATION_FAILED,
            errors.map((err) => ({
              property: err.property,
              constraints: err.constraints,
            }))
          )
        );
      }

      const token = await this.authService.login(loginDto, next);
      res.json({ token });
    } catch (error) {
      next(error);
    }
  }
}
