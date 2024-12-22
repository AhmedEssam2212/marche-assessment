import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository";
import { RegisterDto } from "../dtos/user/auth/register.dto";
import { BadRequestException } from "../exceptions/bad-request-exception";
import { ErrorCode } from "../enums/error-code.enum";
import { NextFunction } from "express";
import { LoginDto } from "../dtos/user/auth/login.dto";

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(
    { username, password, role }: RegisterDto,
    next: NextFunction
  ): Promise<string> {
    const SALT = 10;
    const user = await this.userRepository.findByUsername(username);
    if (user) {
      next(
        new BadRequestException(
          "A user with this username is already exists",
          ErrorCode.USER_ALREADY_EXISTS
        )
      );
      return; // Stop further execution
    }
    const hashedPassword = await bcrypt.hash(password, SALT);
    await this.userRepository.create(username, hashedPassword, role);
    return "User registered successfully. Please log in to continue.";
  }

  async login(
    { username, password }: LoginDto,
    next: NextFunction
  ): Promise<string> {
    const user = await this.userRepository.findByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      next(
        new BadRequestException(
          "Invalid credentials",
          ErrorCode.INVALID_CREDENTIALS
        )
      );
      return; // Exit early if invalid credentials
    }
    return this.generateToken(user.id, user.username, user.role);
  }

  private generateToken(
    userId: number,
    username: string,
    role: string
  ): string {
    return jwt.sign({ userId, username, role }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
  }
}
