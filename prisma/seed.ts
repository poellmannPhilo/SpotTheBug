import prisma from "../lib/prisma";
import path from "path";
import fs, { readFileSync } from "fs";
import solutions from "../resources/quiz/solutions.json";
import { Prisma } from "@prisma/client";

const resourceDir = path.join(process.cwd(), "resources/quiz/code");
const fileNames = fs.readdirSync(resourceDir);

const getIdByFilePath = (fileName: string): number => {
  return Number(fileName.replace("quiz_", "").replace(".txt", ""));
};

const persistQuiz = async (id: number, quizContent: string) => {
  console.log(`Try to persist Quiz with id ${id}`);
  try {
    const quiz = await prisma.quiz.findUnique({
      where: {
        internalId: id,
      },
    });
    if (quiz) {
      //TODO: Check if something changed and potentially update it
      console.log(`Quiz with id ${id} already exists`);
    } else {
      const quizSolution = solutions.find((solution) => solution.id == id);
      if (!quizSolution) {
        throw new Error(`Quiz with id ${id} does not exist in solutions.json`);
      } else {
        // Object for the db interface for the correct solution
        const solution = quizSolution.solution;
        const solutionObj: Prisma.QuizOptionCreateManyQuizInput = {
          isCorrect: true,
          title: solution,
        };

        //Array of object for the db for the incorrect solutions
        const options = quizSolution.options;
        const optionsObj: Array<Prisma.QuizOptionCreateManyQuizInput> =
          options.map((option) => {
            return {
              isCorrect: false,
              title: option,
            };
          });

        //Combined correct and incorrect options
        const allOptions: Array<Prisma.QuizOptionCreateManyQuizInput> = [
          solutionObj,
          ...optionsObj,
        ];

        await prisma.quiz.create({
          data: {
            code: quizContent,
            internalId: id,
            options: {
              createMany: {
                data: allOptions,
              },
            },
          },
        });
      }
    }
    console.log(`Quiz with id ${id} succesfully persisted to db \n\n`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

try {
    fileNames.forEach((fileName: string) => {
    const id = getIdByFilePath(fileName);
    const quizContent = readFileSync(
      process.cwd() + "/resources/quiz/code/" + fileName,
      "utf-8"
    );
    persistQuiz(id, quizContent);
  });
} finally {
  prisma.$disconnect();
}
