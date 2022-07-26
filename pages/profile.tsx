import type { NextPage } from "next";
import { useEffect, useState } from "react";
import UserAvatar from "../components/Menu/UserAvatar";
import QuizResultRow from "../components/Profile/QuizResultRow";
import { IQuizResultGetResponse, IQuizResult } from "./api/quizResult";
import style from "../styles/Profile.module.css";

const Profile: NextPage = () => {
  const [quizResults, setQuizResults] = useState<Array<IQuizResult>>([]);

  useEffect(() => {
    const fetchQuizResults = async () => {
      const response = await fetch("api/quizResult", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const _quizResults: IQuizResultGetResponse = await response.json();
      setQuizResults(_quizResults.quizResults);
    };
    fetchQuizResults();
  }, []);
  return (
    <>
      <h1>Quiz Results</h1>
      {quizResults.map((quizResult: IQuizResult) => {
        return (
          <QuizResultRow
            key={quizResult.id}
            quizResult={quizResult}
          ></QuizResultRow>
        );
      })}
    </>
  );
};

export default Profile;
