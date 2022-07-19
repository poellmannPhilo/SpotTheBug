import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import styles from "../../styles/modules/Results.module.css";

interface ResultProps {
  numCorrectAnswers: number;
  numQuizes: number;
  onTryAgain: () => void;
}

export default function Results({
  numCorrectAnswers,
  numQuizes,
  onTryAgain,
}: ResultProps) {
  const messages = [
    "JS can be a bit hacky. More luck next time. :)",
    "Not too bad. Stick around to make 100% soon.",
    "The student has become the master",
  ];

  const percentage = (numCorrectAnswers / numQuizes) * 100;

  const getMotivationalMessage = (percentage: number) => {
    if (percentage < 30) {
      return messages[0];
    }
    if (percentage < 60) {
      return messages[1];
    } else {
      return messages[2];
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.circularProgressContainer}>
        <CircularProgressbar
          value={percentage}
          text={`${percentage.toFixed(0)}%`}
        />
      </div>
      <h3>{getMotivationalMessage(percentage)}</h3>
      <button onClick={onTryAgain}>Try Again</button>
    </div>
  );
}
