export interface IQuizOptionDTO {
  answer: string;
}

export interface IQuizResultEntriesDTO {
  quizResultEntries: {
    quizId: string;
    quizOptionId: string;
    startTimestamp: Date;
    endTimestamp: Date;
  }[];
}
