import { Router } from "express";
import { GameController } from "../controllers/game.controller";
import { GameService } from "../services/game.service";
import { RoleGuard } from "../decorators/role.decorator";
import { Role } from "../enums/role.enum";
import { GameRepository } from "../repositories/game.repository";
import { LeaderboardRepository } from "../repositories/leaderboard.repository";
import { QuestionRepository } from "../repositories/question.repository";

const gameRouter = Router();
const gameRepository = new GameRepository();
const leaderboardRepository = new LeaderboardRepository();
const questionRepository = new QuestionRepository();
const gameService = new GameService(
  gameRepository,
  leaderboardRepository,
  questionRepository
);
const gameController = new GameController(gameService);

gameRouter.post(
  "",
  RoleGuard([Role.HOST]),
  gameController.create.bind(gameController)
);

gameRouter.post(
  "/:gameId/join",
  RoleGuard([Role.PLAYER]),
  gameController.join.bind(gameController)
);

gameRouter.post(
  "/:gameId/start",
  RoleGuard([Role.HOST]),
  gameController.start.bind(gameController)
);

gameRouter.get(
  "/:gameId/question",
  RoleGuard(Object.values(Role)),
  gameController.getQuestion.bind(gameController)
);

gameRouter.post(
  "/:gameId/answer",
  RoleGuard(Object.values(Role)),
  gameController.submitAnswer.bind(gameController)
);

gameRouter.get(
  "/:gameId/leaderboard",
  RoleGuard(Object.values(Role)),
  gameController.getLeaderboard
);

export default gameRouter;
