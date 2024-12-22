import { IsNotEmpty, IsString, MinLength, MaxLength } from "class-validator";

export class LoginDto {
  @IsNotEmpty({ message: "Username is required." })
  @IsString({ message: "Username must be a string." })
  @MaxLength(50, { message: "Username must not exceed 50 characters." })
  username: string;

  @IsNotEmpty({ message: "Password is required." })
  @IsString({ message: "Password must be a string." })
  @MinLength(8, { message: "Password must be at least 8 characters long." })
  @MaxLength(20, { message: "Password must not exceed 20 characters." })
  password: string;
}
