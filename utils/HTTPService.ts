import { QuizOption } from "@prisma/client";
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { IQuizResultEntry } from "../components/Quiz/types";
import { IQuizOptionDTO, IQuizResultEntriesDTO } from "../types/dto";

import { formatTimestamp } from "./timestamps";

const BASEURL = "http://localhost:3000/api/";
export abstract class HTTPService {
  protected instance: AxiosInstance;
  token: string | undefined;
  baseURL: string;

  constructor(baseURL: string, token?: string) {
    this.baseURL = baseURL;
    this.instance = axios.create({
      baseURL,
    });
    if (token) {
      this.token = token;
    }

    this.initializeRequestInterceptor();
    this.initializeResponseInterceptor();
  }

  private handleRequest = (config: AxiosRequestConfig) => {
    return config;
  };

  private handleResponse = (response: AxiosResponse) => {
    console.log(
      `Status Code ${response.status} - ${formatTimestamp(new Date())} - ${
        response.config.url
      }`
    );
    return response;
  };

  private handleError = (error: AxiosError) => {
    console.error(
      `${error.message} - ${formatTimestamp(new Date())} - ${error.config.url}`
    );
    return error;
  };

  private initializeRequestInterceptor = () => {
    this.instance.interceptors.request.use(this.handleRequest);
  };

  private initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(
      this.handleResponse,
      this.handleError
    );
  };
}

//Quiz
export class QuizService extends HTTPService {
  private static path = "quiz";

  constructor() {
    super(BASEURL);
  }

  public getFullQuiz = async () => {
    const quiz = await this.instance.get(QuizService.path);
    return quiz.data;
  };

  public checkAnswer = async (
    quizId: string,
    option: QuizOption
  ): Promise<boolean> => {
    const path = `${QuizService.path}/${quizId}`;
    const body: IQuizOptionDTO = {
      answer: option.id,
    };
    const response = await this.instance.post(path, body);
    return response.data.correct;
  };
}

export class QuizResultService extends HTTPService {
  private static path = "quizResult";

  constructor() {
    super(BASEURL);
  }

  public generateQuizResult = async (
    quizResultEntries: Array<IQuizResultEntry>
  ) => {
    const body: IQuizResultEntriesDTO = {
      quizResultEntries: quizResultEntries.map((quizResultEntry) => {
        return {
          quizId: quizResultEntry.quizId,
          quizOptionId: quizResultEntry.quizOptionId,
          startTimestamp: quizResultEntry.startTimestamp,
          endTimestamp: quizResultEntry.endTimestamp,
        };
      }),
    };
    const quizResult = await this.instance.post(QuizResultService.path, body);
    return quizResult.data;
  };
}
