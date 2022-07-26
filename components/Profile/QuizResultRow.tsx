import styles from "../../styles/Profile.module.css";
import { IQuizResult } from "../../pages/api/quizResult";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import resultStyles from "../../styles/modules/Results.module.css";
import { formatTimestamp } from "../../utils/timestamps";

interface QuizResultRowProps {
  quizResult: IQuizResult;
}
const QuizResultRow = ({ quizResult }: QuizResultRowProps) => {
  const percentage =
    quizResult.numAnswers > 0
      ? (quizResult.numCorrectAnswers / quizResult.numAnswers) * 100
      : 0;
  const numSeconds = (quizResult.timeSpent / 1000).toFixed(1) + " s";
  return (
    <div className={styles.quizResultRow}>
      <h3>{formatTimestamp(new Date(quizResult.timestamp))}</h3>
      <h3>{numSeconds}</h3>
      <div className={styles.circularProgressContainer}>
        <CircularProgressbar
          value={percentage}
          text={`${percentage.toFixed(0)}%`}
        ></CircularProgressbar>
      </div>
    </div>
  );
};

export default QuizResultRow;
