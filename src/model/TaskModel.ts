import Problem from "../interfaces/Problem";
import Solution from "../interfaces/Solution";

export default interface Task {
    problem: Problem;
    bestPossibleScore: number;

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
    isValidSolution(solution: Solution): boolean;
}
