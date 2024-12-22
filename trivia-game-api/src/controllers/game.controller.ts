import { NextFunction, Request, Response } from "express";
import { GameService } from "../services/game.service";
import { BadRequestException } from "../exceptions/bad-request-exception";
import { ErrorCode } from "../enums/error-code.enum";
import { plainToInstance } from "class-transformer";
import { CreateGameDto } from "../dtos/game/create-game.dto";
import { validate } from "class-validator";

export class GameController {
  constructor(private readonly gameService: GameService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const createGameDto = plainToInstance(CreateGameDto, req.body);

      const errors = await validate(createGameDto);
      if (errors.length > 0) {
        throw new BadRequestException(
          "Validation failed",
          ErrorCode.VALIDATION_FAILED,
          errors.map((error) => ({
            property: error.property,
            constraints: error.constraints,
          }))
        );
      }

      const hostId = (req as any).user.userId;
      const game = await this.gameService.create(hostId, createGameDto);

      res.status(201).json(game);
    } catch (error) {
      next(error);
    }
  }

  async join(req: Request, res: Response, next: NextFunction) {
    try {
      const { gameId } = req.params;
      const userId = (req as any).user?.userId;

      if (!userId) {
        next(
          new BadRequestException(
            "User ID is missing",
            ErrorCode.USER_ID_NOT_FOUND
          )
        );
      }

      const game = await this.gameService.join(parseInt(gameId), userId, next);
      res.status(200).json(game);
    } catch (error) {
      next(error);
    }
  }

  async start(req: Request, res: Response, next: NextFunction) {
    try {
      const { gameId } = req.params;
      const userId = (req as any).user?.userId;

      if (!userId) {
        next(
          new BadRequestException(
            "User ID is missing",
            ErrorCode.USER_ID_NOT_FOUND
          )
        );
      }

      const game = await this.gameService.start(parseInt(gameId), next);
      res.status(200).json(game);
    } catch (error) {
      next(error);
    }
  }

  async getQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const { gameId } = req.params;
      const userId = (req as any).user.userId;
      console.log("gameId :", gameId);
      const question = await this.gameService.getQuestion(
        Number(gameId),
        userId,
        next
      );
      res.status(200).json(question);
    } catch (error) {
      next(error);
    }
  }

  async submitAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      const { gameId } = req.params;
      const userId = (req as any).user.userId;
      const { answer } = req.body;

      const result = await this.gameService.submitAnswer(
        Number(gameId),
        userId,
        answer,
        next
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getLeaderboard(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { gameId } = req.params;
      const leaderboard = await this.gameService.getLeaderboard(
        Number(gameId),
        next
      );
      res.status(200).json(leaderboard);
    } catch (error) {
      next(error);
    }
  }
}
