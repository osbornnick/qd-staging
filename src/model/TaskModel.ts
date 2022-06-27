import Problem from "../interfaces/Problem";
import Solution from "../interfaces/Solution";

export default interface TaskModel {
    problem: Problem;
    bestPossibleScore: number;
    instructions: string;

    getName(): string;
    getInstructions(): string;
    getObjectiveName(): string;
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
