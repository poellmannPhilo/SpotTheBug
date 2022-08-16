import styles from "../../styles/modules/Quiz.module.css";
import Choices from "./choices";
import CodeHighlighter from "./codeHighliter";
import { useEffect, useState } from "react";
import ProgressBar from "./progressBar";
import { EQuizState, IQuizResultEntry, IQuizResultEntriesDTO } from "./types";
import Results from "../Results/results";
import { QuizOption, QuizResultEntry } from "@prisma/client";
import { IQuizResult } from "../../pages/api/quizResult";

export default function Quiz() {
  const [step, setStep] = useState<number>(0);
  const [quizes, setQuizes] = useState<Array<any>>([]);
  const [quizState, setQuizState] = useState<EQuizState>(EQuizState.LOADING);
  const [quizResultEntries, setQuizResultEntries] = useState<
    Array<IQuizResultEntry>
  >([]);
  const [quizEntryTimeStamp, setQuizEntryTimestamp] = useState<Date>(
    new Date()
  );
  const [quizResult, setQuizResult] = useState<IQuizResult | null>(null);

  useEffect(() => {
    const fetchQuizes = async () => {
      const response = await fetch("/api/quiz", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const _quizes = await response.json();
      setQuizes(_quizes);
      setQuizState(EQuizState.QUIZING);
    };
    fetchQuizes();
  }, []);

  useEffect(() => {
    if (quizResultEntries.length > 0) {
      goToNextQuiz();
    }
  }, [quizResultEntries]);

  const checkAnswer = async (option: QuizOption): Promise<boolean> => {
    const response = await fetch(`/api/quiz/${quizes[step].id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answer: option.id }),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const result = await response.json();
    return result.correct;
  };

  const addQuizResultEntry = async (option: QuizOption | null) => {
    if (option) {
      const isCorrect = await checkAnswer(option);
      const quizResultEntry: IQuizResultEntry = {
        quizId: quizes[step].id,
        quizOptionId: option.id,
        startTimestamp: quizEntryTimeStamp,
        endTimestamp: new Date(),
        isCorrect: isCorrect,
      };
      setQuizResultEntries([...quizResultEntries, quizResultEntry]);
    }
  };

  const goToNextQuiz = () => {
    const nextQuizExists = step + 1 < quizes.length;
    if (nextQuizExists) {
      setStep(step + 1);
      setQuizEntryTimestamp(new Date());
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    try {
      const body: IQuizResultEntriesDTO = {
        quizResultEntries: quizResultEntries.map((quizResultEntry) => {
          return {
            quizId: quizResultEntry.quizId,
            quizOptionId: quizResultEntry.quizOptionId,
            startTimestamp: quizResultEntry.startTimestamp,
            endTimestamp: quizResultEntry.endTimestamp,
          };
        }),
      };
      const response = await fetch("/api/quizResult", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const quizResult: IQuizResult = await response.json();
      setQuizResult(quizResult);
      setQuizState(EQuizState.RESULTS_SHOWN);
    } catch (error) {
      console.warn(error);
    }
  };

  const resetQuiz = () => {
    setStep(0);
    setQuizState(EQuizState.QUIZING);
    setQuizResultEntries([]);
    setQuizResult(null);
  };

  return (
    <div className={styles.container}>
      {quizState == EQuizState.QUIZING && (
        <>
          <ProgressBar
            entries={quizResultEntries}
            numQuestions={quizes.length}
          ></ProgressBar>
          <CodeHighlighter code={quizes[step].code}></CodeHighlighter>
          <Choices
            options={quizes[step].options}
            onNext={(option: QuizOption | null) => {
              addQuizResultEntry(option);
            }}
            currentQuizIndex={step}
          ></Choices>
        </>
      )}
      {quizState == EQuizState.RESULTS_SHOWN && (
        <Results
          numCorrectAnswers={
            quizResult?.numCorrectAnswers ? quizResult.numCorrectAnswers : 0
          }
          numQuizes={quizResult?.numAnswers ? quizResult.numAnswers : 0}
          onTryAgain={resetQuiz}
        ></Results>
      )}
    </div>
  );
}
