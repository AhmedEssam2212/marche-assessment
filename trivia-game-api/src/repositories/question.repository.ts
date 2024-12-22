import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class QuestionRepository {
  async getCurrentQuestion(gameId: number) {
    return prisma.question.findFirst({
      where: {
        gameId,
      },
      orderBy: {
        id: "asc",
      },
    });
  }
}
