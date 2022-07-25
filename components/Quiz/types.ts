export enum EQuizState {
  LOADING = "LOADING",
  QUIZING = "QUIZING",
  RESULTS_SHOWN = "RESULTS_SHOWN",
}

export interface IQuizResultEntry {
  quizId: string;
  quizOptionId: string;
  startTimestamp: Date;
  endTimestamp: Date;
  isCorrect: boolean;
}

export interface IQuizResultEntriesDTO {
  quizResultEntries: [
    {
      quizId: string;
      quizOptionId: string;
      startTimestamp: Date;
      endTimestamp: Date;
    }
  ];
}
