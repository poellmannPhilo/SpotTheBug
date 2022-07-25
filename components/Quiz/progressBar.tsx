import classNames from "classnames";
import { IQuizResultEntry } from "./types";
import style from "../../styles/modules/Quiz.module.css";
import { QuizResultEntry } from "@prisma/client";
interface ProgressBarBubbleProps {
  entry: IQuizResultEntry | null;
}

interface ProgressBarProps {
  entries: Array<IQuizResultEntry>;
  numQuestions: number;
}

const ProgressBarBubble = ({ entry }: ProgressBarBubbleProps) => {
  if (entry == null) {
    return <div className={classNames(style.progressBarBubble)}></div>;
  } else {
    switch (entry.isCorrect) {
      case true:
        return (
          <div
            className={classNames(
              style.progressBarBubble,
              style.progressBarBubbleCorrect
            )}
          ></div>
        );
      case false:
        return (
          <div
            className={classNames(
              style.progressBarBubble,
              style.progressBarBubbleIncorrect
            )}
          ></div>
        );
      default:
        return <div className={classNames(style.progressBarBubble)}></div>;
    }
  }
};

export default function ProgressBar({
  entries,
  numQuestions,
}: ProgressBarProps) {
  const getQuizResultEntry = (step: number): IQuizResultEntry | null => {
    if (entries[step]) {
      return entries[step];
    } else {
      return null;
    }
  };
  return (
    <div className={style.progressBarContainer}>
      {[...Array(numQuestions)].map((element, i) => {
        return (
          <ProgressBarBubble
            key={i}
            entry={getQuizResultEntry(i)}
          ></ProgressBarBubble>
        );
      })}
    </div>
  );
}
