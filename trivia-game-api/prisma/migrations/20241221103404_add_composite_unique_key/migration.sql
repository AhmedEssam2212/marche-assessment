/*
  Warnings:

  - You are about to drop the column `playerId` on the `Leaderboard` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[gameId,userId]` on the table `Leaderboard` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Leaderboard` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Leaderboard" DROP CONSTRAINT "Leaderboard_playerId_fkey";

-- AlterTable
ALTER TABLE "Leaderboard" DROP COLUMN "playerId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Leaderboard_gameId_userId_key" ON "Leaderboard"("gameId", "userId");

-- AddForeignKey
ALTER TABLE "Leaderboard" ADD CONSTRAINT "Leaderboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
