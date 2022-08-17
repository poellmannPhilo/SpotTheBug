import styles from "../../styles/modules/Quiz.module.css";
import Choices from "./choices";
import CodeHighlighter from "./codeHighliter";
import { useEffect, useState } from "react";
import ProgressBar from "./progressBar";
import { EQuizState, IQuizResultEntry, IQuizResultEntriesDTO } from "./types";
import Results from "../Results/results";
import { QuizOption, QuizResultEntry } from "@prisma/client";
import { IQuizResult } from "../../pages/api/quizResult";
import { QuizResultService, QuizService } from "../../utils/HTTPService";

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
      const quizService = new QuizService();
      const _quizes = await quizService.getFullQuiz();
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
    try {
      const quizService = new QuizService();
      const isCorrect = quizService.checkAnswer(quizes[step].id, option);
      return isCorrect;
    } catch (error) {
      alert("something went wrong");
      return false;
    }
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
    const quizResultService = new QuizResultService();
    const quizResult = await quizResultService.generateQuizResult(
      quizResultEntries
    );
    setQuizResult(quizResult);
    setQuizState(EQuizState.RESULTS_SHOWN);
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
