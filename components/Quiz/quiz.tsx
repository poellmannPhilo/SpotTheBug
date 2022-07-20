import styles from "../../styles/modules/Quiz.module.css";
import Choices from "./choices";
import CodeHighlighter from "./codeHighliter";
import { useEffect, useState } from "react";
import ProgressBar from "./progressBar";
import { EEntryType } from "./types";
import Results from "../Results/results";
import { QuizOption } from "@prisma/client";

const numQuizes = 7;
export default function Quiz() {
  const [id, setId] = useState<number>(0);
  const [code, setCode] = useState<string | null>(null);
  const [options, setOptions] = useState<Array<QuizOption>>([]);
  const [entries, setEntries] = useState<Array<EEntryType>>(
    new Array(numQuizes).fill(EEntryType.UNANSWERED)
  );

  useEffect(() => {
    const fetchQuiz = async () => {
      const response = await fetch(`/api/quiz/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const solution = await response.json();
      console.log(solution);
      console.log(solution.options);
      setCode(solution.code);
      setOptions(solution.options);
    };
    if (id != numQuizes) {
      fetchQuiz();
    }
  }, [id]);

  const checkAnswer = async (answer: string) => {
    const response = await fetch(`/api/quiz/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answer }),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const result = await response.json();
    if (result.correct) {
      setQuizEntry(EEntryType.CORRECT);
    } else {
      setQuizEntry(EEntryType.INCORRECT);
    }
  };

  const setQuizEntry = (entryType: EEntryType) => {
    const newState = entries.map((entry, i) => {
      if (i == id) {
        return entryType;
      } else return entry;
    });
    setEntries(newState);
  };

  const goToNextQuiz = (answer: string | null) => {
    setId(id + 1);
    if (answer) {
      checkAnswer(answer);
    }
  };

  const goToPreviousQuiz = () => {
    setId(id - 1);
  };

  const resetQuiz = () => {
    setId(0);
    setCode(null);
    setOptions([]);
    setEntries(new Array(numQuizes).fill(EEntryType.UNANSWERED));
  };

  const numCorrectAnswers = () => {
    return entries.filter((entry) => entry == EEntryType.CORRECT).length;
  };

  return (
    <div className={styles.container}>
      {id < numQuizes && (
        <>
          <ProgressBar entries={entries}></ProgressBar>
          <CodeHighlighter code={code ? code : ""}></CodeHighlighter>
          <Choices
            options={options}
            onNext={(answer: string | null) => goToNextQuiz(answer)}
            onPrevious={goToPreviousQuiz}
            currentQuizIndex={id}
            currentQuizEntry={entries[id]}
          ></Choices>
        </>
      )}
      {id == numQuizes && (
        <Results
          numCorrectAnswers={numCorrectAnswers()}
          numQuizes={7}
          onTryAgain={resetQuiz}
        ></Results>
      )}
    </div>
  );
}
