import Problem from "../interfaces/Problem";
import Solution from "../interfaces/Solution";

export default interface Task {
    problem: Problem;
    currentSolution: Solution;

    getName(): string;
    getObjectiveName(): string;
    getInstructions(): string;
    isMinimize(): boolean;
    getRandomSolution(): Solution;
    mutateSolution(solution: Solution): Solution;
    crossoverSolution(sol1: Solution, solution: Solution): Solution;
    setProblem(problem: Problem): void;
    setRandomProblem(): void;
    scoreSolution(solution: Solution): Number;
}
