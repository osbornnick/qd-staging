import Problem from "../interfaces/Problem.js";
import Solution from "../interfaces/Solution.js";

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
    getProblem(): Problem;
    setSolution(solution: Solution): void;
    getSolution(): Solution;
    updateSolution(newSol: Solution): void;
    setRandomProblem(): void;
    scoreSolution(solution: Solution): number;
}
