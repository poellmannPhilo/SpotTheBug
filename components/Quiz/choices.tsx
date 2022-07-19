import { useState } from "react";
import styles from "../../styles/modules/Quiz.module.css";
import classNames from "classnames";
import { EEntryType } from "./types";

interface ChoiceProps {
  text: string;
  onClick: () => void;
  isSelected: boolean;
  isDisabled: boolean;
}

interface ChoicesProps {
  texts: Array<string>;
  onPrevious: () => void;
  onNext: (answer: string | null) => void;
  currentQuizIndex: number;
  currentQuizEntry: EEntryType;
}

export function Choice({ text, onClick, isSelected, isDisabled }: ChoiceProps) {
  return (
    <button
      className={classNames("multipleChoice", {
        multipleChoiceSelected: isSelected,
      })}
      onTouchStart={onClick}
      disabled={isDisabled}
    >
      <p className="code">{text}</p>
    </button>
  );
}

export default function Choices({
  texts,
  onNext,
  onPrevious,
  currentQuizIndex,
  currentQuizEntry,
}: ChoicesProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const onChoiceSelected = (_selectedAnswer: string) => {
    console.log("choice selected");
    if (_selectedAnswer == selectedAnswer) {
      setSelectedAnswer(null);
    } else {
      setSelectedAnswer(_selectedAnswer);
    }
  };

  return (
    <div className={styles.choicesContainer}>
      <div className={styles.choiceGrid}>
        {texts.map((text: string, i: number) => {
          return (
            <Choice
              key={text}
              text={text}
              onClick={() => onChoiceSelected(text)}
              isSelected={selectedAnswer === text}
              isDisabled={currentQuizEntry !== EEntryType.UNANSWERED}
            ></Choice>
          );
        })}
      </div>
      <div className={styles.submitButtonContainer}>
        <button
          className={styles.submitChoicesButton}
          onClick={() => {
            onPrevious();
            setSelectedAnswer(null);
          }}
          disabled={currentQuizIndex == 0}
        >
          Previous
        </button>
        <button
          className={styles.submitChoicesButton}
          onClick={() => {
            onNext(selectedAnswer);
            setSelectedAnswer(null);
          }}
          disabled={
            selectedAnswer == null && currentQuizEntry == EEntryType.UNANSWERED
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}
