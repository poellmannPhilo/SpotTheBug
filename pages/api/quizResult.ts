// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  Prisma,
  QuizResult,
  QuizResultEntry,
  QuizOption,
} from "@prisma/client";
import prisma from "../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";

export type Data = {
  quizResultEntries: Array<QuizResultEntry>;
};

export type IQuizResultGetResponse = {
  quizResults: Array<IQuizResult>;
};

export type IQuizResult = {
  id: string;
  numAnswers: number;
  numCorrectAnswers: number;
  timeSpent: number;
  timestamp: string;
  quizes: {
    id: string;
    code: string;
    timeSpent: number;
    options: {
      id: string;
      title: string;
      isCorrect: boolean;
      wasChosen: boolean;
    }[];
  }[];
};

export type QuizResultExpanded = {
  id: string;
  createdAt: Date;
  quizResultEntries: (QuizResultEntry & {
    quiz: {
      options: QuizOption[];
      id: string;
      code: string;
    };
    quizOption: {
      id: string;
      title: string;
      isCorrect: boolean;
    };
  })[];
};

const generateQuizResult = (quizResult: QuizResultExpanded): IQuizResult => {
  const _quizes = quizResult.quizResultEntries.map((quizResultEntry) => {
    const _options = quizResultEntry.quiz.options.map((quizOption) => {
      const _wasChosen: boolean = quizOption.id == quizResultEntry.quizOptionId;
      return {
        id: quizOption.id,
        title: quizOption.title,
        isCorrect: quizOption.isCorrect,
        wasChosen: _wasChosen,
      };
    });
    const timeSpentOnQuiz =
      quizResultEntry.endTimestamp.getTime() -
      quizResultEntry.startTimestamp.getTime();
    return {
      id: quizResultEntry.quiz.id,
      code: quizResultEntry.quiz.code,
      timeSpent: timeSpentOnQuiz,
      options: _options,
    };
  });
  const numCorrectAnswers = _quizes.filter(
    (quiz) =>
      quiz.options.filter(
        (quizOption) => quizOption.isCorrect && quizOption.wasChosen
      ).length != 0
  ).length;
  const timeSpentTotal = _quizes.reduce(
    (partialSum, quiz) => partialSum + quiz.timeSpent,
    0
  );
  return {
    id: quizResult.id,
    numAnswers: quizResult.quizResultEntries.length,
    numCorrectAnswers: numCorrectAnswers,
    timeSpent: timeSpentTotal,
    timestamp: quizResult.createdAt.toString(),
    quizes: _quizes,
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  const email = session?.user?.email != null ? session?.user?.email : undefined;
  const { method, body } = req;

  const _body: Data = req.body;
  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  switch (method) {
    case "GET": {
      const quizResults = await prisma.quizResult.findMany({
        where: {
          User: {
            email: email,
          },
        },
        select: {
          id: true,
          createdAt: true,
          quizResultEntries: {
            include: {
              quiz: {
                select: {
                  id: true,
                  code: true,
                  options: true,
                },
              },
              quizOption: {
                select: {
                  id: true,
                  title: true,
                  isCorrect: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      const _quizResults = quizResults.map((quizResult) =>
        generateQuizResult(quizResult)
      );
      const response: IQuizResultGetResponse = {
        quizResults: _quizResults.filter(
          (quizResult) => quizResult.numAnswers == 7
        ),
      };
      if (!quizResults) {
        res.status(500).json({ message: "Something went wrong" });
      } else {
        res.status(200).json(response);
      }
    }
    case "POST": {
      const quizResult = await prisma.quizResult.create({
        data: {
          quizResultEntries: {
            createMany: {
              data: _body.quizResultEntries,
            },
          },
          User: {
            connect: {
              email: email,
            },
          },
        },
        select: {
          id: true,
          createdAt: true,
          quizResultEntries: {
            include: {
              quiz: {
                select: {
                  id: true,
                  code: true,
                  options: true,
                },
              },
              quizOption: {
                select: {
                  id: true,
                  title: true,
                  isCorrect: true,
                },
              },
            },
          },
        },
      });
      if (quizResult) {
        res.status(500).json({ message: "Something went wrong" });
      } else {
        res.status(200).json(generateQuizResult(quizResult));
      }
    }
  }
}
