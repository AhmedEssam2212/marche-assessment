import { IsNumber, IsOptional, Min } from "class-validator";

export class CreateGameDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPlayers?: number;
}
