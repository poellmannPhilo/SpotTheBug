import type { NextApiRequest, NextApiResponse } from "next";
import FileReader from "../../../utils/FileReader";
import solutions from "../../../resources/quiz/solutions.json";
import QuizSolutions from "../../../utils/QuizSolutions";

export default function quizHandler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
    body,
  } = req;

  const index = Number(id);

  switch (method) {
    case "GET":
      let fileReader = new FileReader();
      fileReader.filepath = `/quiz/quiz_${index}.txt`;
      const code = fileReader.syncReadFile();
      const options = QuizSolutions.getOptions(index);
      res.status(200).json({ id, code: code, options });
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
