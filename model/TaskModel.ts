import Problem from "../interfaces/Problem.js";
import Solution from "../interfaces/Solution.js";

export default interface Task {
    problem: Problem;

    getName(): string;
    getObjectiveName(): string;
    getInstructions(): string;
    isMinimize(): boolean;
    getRandomSolution(): Solution;
    mutateSolution(solution: Solution): Solution;
    crossoverSolution(sol1: Solution, sol2: Solution): Solution;
    setProblem(problem: Problem): void;
    getProblem(): Problem;
    updateSolution(oldSol: Solution, newSol: Solution): Solution;
    setRandomProblem(): void;
    scoreSolution(solution: Solution): number;
}
