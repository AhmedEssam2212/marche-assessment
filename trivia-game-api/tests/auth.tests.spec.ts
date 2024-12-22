import { AuthService } from "../src/services/auth.service";
import { UserRepository } from "../src/repositories/user.repository";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { ErrorCode } from "../src/enums/error-code.enum";
import { BadRequestException } from "../src/exceptions/bad-request-exception";
import { Role } from "../src/enums/role.enum";
import { NextFunction } from "express";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

// Mock dependencies
jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

describe("AuthService", () => {
  let authService: AuthService;
  let userRepository: jest.Mocked<UserRepository>;
  let next: jest.Mock;

  beforeEach(() => {
    userRepository = {
      findByUsername: jest.fn(),
      create: jest.fn(),
    } as jest.Mocked<UserRepository>;

    authService = new AuthService(userRepository);

    // Mock bcrypt and jwt
    (bcrypt.hash as jest.Mock as any).mockResolvedValue("hashedPassword");
    (bcrypt.compare as jest.Mock as any).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("mocked-jwt-token");

    next = jest.fn();
  });

  // Register tests
  describe("register", () => {
    it("should register a user successfully", async () => {
      const registerDto = {
        username: "testuser",
        password: "password123",
        role: Role.HOST,
      };

      userRepository.findByUsername.mockResolvedValue(null); // No existing user
      userRepository.create.mockResolvedValue(undefined); // Simulate successful user creation

      const result = await authService.register(registerDto, next);

      expect(result).toBe(
        "User registered successfully. Please log in to continue."
      );
      expect(userRepository.findByUsername).toHaveBeenCalledWith(
        registerDto.username
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(userRepository.create).toHaveBeenCalledWith(
        registerDto.username,
        "hashedPassword",
        registerDto.role
      );
      expect(next).not.toHaveBeenCalled();
    });
  });

  // Login tests
  describe("login", () => {
    it("should return a token when login is successful", async () => {
      const loginDto = {
        username: "testuser",
        password: "password123",
      };

      const user = {
        id: 1,
        username: "testuser",
        password: "hashedPassword",
        role: Role.PLAYER,
      };

      userRepository.findByUsername.mockResolvedValue(user); // Simulate user found
      (bcrypt.compare as jest.Mock as any).mockResolvedValue(true); // Simulate correct password

      const result = await authService.login(loginDto, next);

      expect(result).toBe("mocked-jwt-token"); // Expect mocked JWT token
      expect(userRepository.findByUsername).toHaveBeenCalledWith(
        loginDto.username
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        user.password
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRATION }
      );
      expect(next).not.toHaveBeenCalled();
    });
  });
});
