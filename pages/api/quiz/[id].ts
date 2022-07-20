import type { NextApiRequest, NextApiResponse } from "next";
import FileReader from "../../../utils/FileReader";
import solutions from "../../../resources/quiz/solutions.json";
import QuizSolutions from "../../../utils/QuizSolutions";
import prisma from "../../../lib/prisma";
import { Quiz } from "@prisma/client";

export default async function quizHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    method,
    body,
  } = req;

  const index = Number(id);

  switch (method) {
    case "GET":
      const quiz = await prisma.quiz.findUnique({
        where:{
          internalId: Number(id),
        },
        select: {
          id: true,
          code: true,
          options: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });
      if (!quiz) {
        res.status(500).json({ message: "Something went wrong" });
      } else {
        res.status(200).json({ id, code: quiz.code, options: quiz.options });
      }
      break;

    case "POST":
      const correctAnswer = QuizSolutions.getSolution(index);
      const givenAnswer = body.answer;
      res.status(200).json({ correct: correctAnswer == givenAnswer });
      break;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
