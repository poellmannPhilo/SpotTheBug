// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Quiz } from "@prisma/client";
import prisma from "../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const session = await unstable_getServerSession(req, res, authOptions);
  const { method } = req;

  switch (method) {
    case "GET":
      const quizes = await prisma.quiz.findMany({
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

      if (!quizes) {
        res.status(500).json({ message: "Something went wrong" });
      } else {
        res.status(200).json(quizes);
      }
  }
}
