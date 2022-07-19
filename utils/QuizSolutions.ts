import solutions from "../resources/quiz/solutions.json";

interface Solution {
  id: number;
  solution: string;
  options: Array<string>;
}

export default class QuizSolutions {
  static getOptions = (id: number) => {
    const solution = solutions.find((solution: Solution) => solution.id == id);
    if (solution) {
      const options = solution.options;
      return this.shuffle(options.concat(solution.solution));
    }
  };

  static getSolution = (id: number) => {
    const solution = solutions.find((solution: Solution) => solution.id == id);
    if (solution) {
      return solution.solution;
    }
  };

  static shuffle = (arr: Array<any>) => arr.sort(() => 0.5 - Math.random());
}
