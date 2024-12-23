import { GameRepository } from "../repositories/game.repository";
import { PrismaClient } from "@prisma/client";
import { CreateGameDto } from "../dtos/game/create-game.dto";
import { BadRequestException } from "../exceptions/bad-request-exception";
import { NextFunction } from "express";
import { ErrorCode } from "../enums/error-code.enum";
import { GameStatus } from "../enums/game-status.enum";
import { UnAuthorizedException } from "../exceptions/un-authorized-exception";
import { SubmitAnswer } from "submit-answer.type";
import { LeaderboardRepository } from "../repositories/leaderboard.repository";
import { QuestionRepository } from "../repositories/question.repository";
import { fetchAndSaveTriviaQuestions } from "../utils/trivia.api";

const prisma = new PrismaClient();

export class GameService {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly leaderboardRepository: LeaderboardRepository,
    private readonly questionRepository: QuestionRepository
  ) {}

  async create(hostId: number, { maxPlayers }: CreateGameDto) {
    const game = await this.gameRepository.create(hostId, maxPlayers);
    await fetchAndSaveTriviaQuestions(game.id);
    return game;
  }

  async join(gameId: number, userId: number, next: NextFunction) {
    const game = await this.gameRepository.findById(gameId);
    if (!game) {
      next(
        new BadRequestException("Game not found", ErrorCode.ENTITY_NOT_FOUND)
      );
    }

    if (game.currentPlayers >= game.maxPlayers) {
      next(
        new BadRequestException("Game is already full", ErrorCode.GAME_IS_FULL)
      );
    }

    return this.gameRepository.addPlayer(gameId, userId);
  }

  async start(gameId: number, next: NextFunction) {
    const game = await this.gameRepository.findById(gameId);
    if (!game) {
      throw new BadRequestException(
        "Game not found",
        ErrorCode.ENTITY_NOT_FOUND
      );
    }

    if (game.currentPlayers < 2) {
      next(
        new BadRequestException(
          "Not enough players to start the game",
          ErrorCode.PLAYERS_NOT_ENOUGH
        )
      );
    }
    await this.initializeLeaderboard(gameId);
    return this.gameRepository.updateStatus(gameId, GameStatus.IN_PROGRESS);
  }

  async initializeLeaderboard(gameId: number) {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: { players: true },
    });

    if (!game) {
      throw new BadRequestException(
        `Game with ID ${gameId} not found`,
        ErrorCode.ENTITY_NOT_FOUND
      );
    }

    const leaderboardEntries = game.players.map((player: any) => ({
      gameId,
      userId: player.id,
      score: 0,
    }));

    await prisma.leaderboard.createMany({
      data: leaderboardEntries,
      skipDuplicates: true,
    });
  }

  async getQuestion(gameId: number, userId: number, next: NextFunction) {
    const game = await this.gameRepository.findById(gameId);
    if (!game) {
      next(
        new BadRequestException(
          `Game with ID ${gameId} not found`,
          ErrorCode.ENTITY_NOT_FOUND
        )
      );
    }

    if (!game.players.some((player: any) => player.id === userId)) {
      next(
        new UnAuthorizedException(
          "You are not part of this game",
          ErrorCode.UN_AUTHORIZED_EXCEPTION
        )
      );
    }

    const question = await this.questionRepository.getCurrentQuestion(gameId);
    if (!question) {
      next(
        new BadRequestException(
          "No current question found for this game",
          ErrorCode.ENTITY_NOT_FOUND
        )
      );
    }
    return question;
  }

  async submitAnswer(
    gameId: number,
    userId: number,
    answer: string,
    next: NextFunction
  ): Promise<SubmitAnswer> {
    const question = await this.getQuestion(gameId, userId, next);

    const isCorrect = question.correctAnswer === answer;

    if (isCorrect) {
      await this.leaderboardRepository.updateScore(gameId, userId);
    }

    return {
      isCorrect: isCorrect,
      score: await this.leaderboardRepository.getScore(gameId, userId),
    };
  }

  async getLeaderboard(gameId: number, next: NextFunction) {
    const game = await this.gameRepository.findById(gameId);
    if (!game) {
      next(
        new BadRequestException(
          `Game with ID ${gameId} not found`,
          ErrorCode.ENTITY_NOT_FOUND
        )
      );
    }

    const leaderboard = await this.leaderboardRepository.findAll(gameId);
    if (!leaderboard || leaderboard.length === 0) {
      next(
        new BadRequestException(
          `No leaderboard data found for game ID ${gameId}`,
          ErrorCode.ENTITY_NOT_FOUND
        )
      );
    }

    return leaderboard.map((entry: any) => ({
      playerId: entry.userId,
      playerName: entry.player.username,
      score: entry.score,
    }));
  }
}
