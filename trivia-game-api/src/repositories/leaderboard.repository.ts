import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class LeaderboardRepository {
  async updateScore(gameId: number, userId: number) {
    await prisma.leaderboard.update({
      where: {
        gameId_userId: { gameId, userId },
      },
      data: {
        score: { increment: 1 },
      },
    });
  }

  async getScore(gameId: number, userId: number) {
    const leaderboard = await prisma.leaderboard.findUnique({
      where: {
        gameId_userId: { gameId, userId },
      },
    });
    return leaderboard?.score || 0;
  }

  async findAll(gameId: number) {
    console.log("GGGGGGG");
    try {
      return await prisma.leaderboard.findMany({
        where: { gameId },
        orderBy: { score: "desc" },
        include: {
          player: { select: { id: true, username: true } },
        },
      });
    } catch (err) {
      console.log("Error", err);
    }
  }
}
