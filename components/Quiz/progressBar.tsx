import classNames from "classnames";
import { EEntryType } from "./types";
import style from "../../styles/modules/Quiz.module.css";
interface ProgressBarBubbleProps {
  entryType: EEntryType;
}

interface ProgressBarProps {
  entries: Array<EEntryType>;
}

const ProgressBarBubble = ({ entryType }: ProgressBarBubbleProps) => {
  switch (entryType) {
    case EEntryType.CORRECT:
      return (
        <div
          className={classNames(
            style.progressBarBubble,
            style.progressBarBubbleCorrect
          )}
        ></div>
      );
    case EEntryType.INCORRECT:
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
};

export default function ProgressBar({ entries }: ProgressBarProps) {
  return (
    <div className={style.progressBarContainer}>
      {entries.map((entry, i) => {
        return (
          <ProgressBarBubble key={i} entryType={entry}></ProgressBarBubble>
        );
      })}
    </div>
  );
}
