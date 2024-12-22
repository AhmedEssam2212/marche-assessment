import { PrismaClient } from "@prisma/client";
import { GameStatus } from "../enums/game-status.enum";

const prisma = new PrismaClient();

export class GameRepository {
  async create(hostId: number, maxPlayers?: number) {
    return prisma.game.create({
      data: {
        hostId,
        maxPlayers,
      },
    });
  }

  async findById(gameId: number) {
    return prisma.game.findUnique({
      where: { id: gameId },
      include: { players: true },
    });
  }

  async addPlayer(gameId: number, userId: number) {
    return prisma.game.update({
      where: { id: gameId },
      data: {
        currentPlayers: { increment: 1 },
        players: { connect: { id: userId } },
      },
    });
  }

  async updateStatus(gameId: number, status: GameStatus) {
    return prisma.game.update({
      where: { id: gameId },
      data: { status },
    });
  }
}
