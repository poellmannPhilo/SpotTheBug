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

  switch (method) {
    case "GET":
      // Get data from your database
      let fileReader = new FileReader();
      fileReader.filepath = `resources/quiz/quiz_${id}.ts`;
      const code = fileReader.syncReadFile();
      const options = QuizSolutions.getOptions(id);
      res.status(200).json({ id, code: code, options });
      break;
    case "POST":
      const correctAnswer = QuizSolutions.getSolution(id);
      const givenAnswer = body.answer;
      console.log(correctAnswer);
      console.log(givenAnswer);
      res.status(200).json({ correct: correctAnswer == givenAnswer });
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
