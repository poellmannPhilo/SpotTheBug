// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Quiz, QuizResultEntry } from "@prisma/client";
import prisma from "../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export type Data = {
  quizResultEntries: Array<QuizResultEntry>;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;

  const _body: Data = req.body;

  switch (method) {
    case "POST":
      const quizResult = await prisma.quizResult.create({
        data: {
          quizResultEntries: {
            createMany: {
              data: { ..._body.quizResultEntries },
            },
          },
        },
      });

      if (!quizResult) {
        res.status(500).json({ message: "Something went wrong" });
      } else {
        res.status(200).json(quizResult);
      }
  }
}
