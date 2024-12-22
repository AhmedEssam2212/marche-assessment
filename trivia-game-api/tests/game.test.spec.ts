import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { GameService } from "../src/services/game.service";
import { GameRepository } from "../src/repositories/game.repository";
import { LeaderboardRepository } from "../src/repositories/leaderboard.repository";
import { QuestionRepository } from "../src/repositories/question.repository";
import { NextFunction } from "express";
import { Role } from "../src/enums/role.enum";
import { GameStatus } from "../src/enums/game-status.enum";

jest.mock("../src/repositories/game.repository");
jest.mock("../src/repositories/leaderboard.repository");
jest.mock("../src/repositories/question.repository");

describe("GameService", () => {
  let gameService: GameService;
  let gameRepository: jest.Mocked<GameRepository>;
  let leaderboardRepository: jest.Mocked<LeaderboardRepository>;
  let questionRepository: jest.Mocked<QuestionRepository>;
  let next: jest.Mock<NextFunction>;

  beforeEach(() => {
    gameRepository = new GameRepository() as jest.Mocked<GameRepository>;
    leaderboardRepository =
      new LeaderboardRepository() as jest.Mocked<LeaderboardRepository>;
    questionRepository =
      new QuestionRepository() as jest.Mocked<QuestionRepository>;
    gameService = new GameService(
      gameRepository,
      leaderboardRepository,
      questionRepository
    );

    next = jest.fn() as any;
  });

  describe("join", () => {
    describe("join", () => {
      it("should successfully add a player to a game", async () => {
        const gameId = 1;
        const userId = 2;

        const players: any[] = [
          {
            id: userId,
            username: "player1",
            password: "password123",
            role: Role.PLAYER,
          },
        ];

        const game = {
          id: gameId,
          currentPlayers: 1,
          maxPlayers: 4,
          players: players,
          hostId: 1,
          status: GameStatus.WAITING,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        gameRepository.findById.mockResolvedValue(game);
        gameRepository.addPlayer.mockResolvedValue(game);

        const result = await gameService.join(gameId, userId, next as any);

        expect(gameRepository.findById).toHaveBeenCalledWith(gameId);
        expect(gameRepository.addPlayer).toHaveBeenCalledWith(gameId, userId);
        expect(result).toBe(game);
        expect(next).not.toHaveBeenCalled();
      });
    });
  });
});
