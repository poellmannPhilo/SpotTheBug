import { useState } from "react";
import styles from "../../styles/modules/Quiz.module.css";
import classNames from "classnames";
import { QuizOption } from "@prisma/client";

interface ChoiceProps {
  text: string;
  onClick: () => void;
  isSelected: boolean;
  isDisabled: boolean;
}

interface ChoicesProps {
  options: Array<QuizOption>;
  onNext: (option: QuizOption | null) => void;
  currentQuizIndex: number;
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
  options,
  onNext,
  //onPrevious,
  currentQuizIndex,
}: ChoicesProps) {
  const [selectedOption, setSelectedOption] = useState<QuizOption | null>(null);

  const onChoiceSelected = (_selectedOption: QuizOption) => {
    if (selectedOption == null) {
      setSelectedOption(_selectedOption);
    } else {
      _selectedOption.id == selectedOption.id
        ? setSelectedOption(null)
        : setSelectedOption(_selectedOption);
    }
  };

  return (
    <div className={styles.choicesContainer}>
      <div className={styles.choiceGrid}>
        {options.map((option: QuizOption, i: number) => {
          return (
            <Choice
              key={option.id}
              text={option.title}
              onClick={() => onChoiceSelected(option)}
              isSelected={selectedOption?.id === option.id}
              isDisabled={false}
            ></Choice>
          );
        })}
      </div>
      <div className={styles.submitButtonContainer}>
        <button
          className={styles.submitChoicesButton}
          onClick={() => {
            onNext(selectedOption);
            setSelectedOption(null);
          }}
          disabled={selectedOption == null}
        >
          Next
        </button>
      </div>
    </div>
  );
}
