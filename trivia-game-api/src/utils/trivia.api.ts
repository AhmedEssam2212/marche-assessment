import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function fetchAndSaveTriviaQuestions(gameId: number) {
  try {
    const response = await axios.get("https://the-trivia-api.com/v2/questions");

    const questions = response.data;

    const formattedQuestions = questions.map(
      (question: any, index: number) => ({
        gameId,
        question: question.question.text,
        options: shuffleArray([
          question.correctAnswer,
          ...question.incorrectAnswers,
        ]),
        correctAnswer: question.correctAnswer,
        order: index + 1,
      })
    );

    await prisma.question.createMany({
      data: formattedQuestions,
      skipDuplicates: true,
    });

    console.log("Trivia questions fetched and saved successfully!");
  } catch (error) {
    console.error("Error fetching trivia questions:", error);
  }
}

function shuffleArray(array: string[]): string[] {
  return array.sort(() => Math.random() - 0.5);
}
