import TaskModel from "./TaskModel";
import Problem from "../interfaces/Problem";
import Solution from "../interfaces/Solution";

export default class TSPModel implements TaskModel {
    problem: Problem;
    currentSolution: Solution;

    getName(): string {
        return "Traveling Salesman Problem";
    }
    getObjectiveName(): string {
        return "route length";
    }
    getInstructions(): string {
        throw new Error("Method not implemented.");
    }
    isMinimize(): boolean {
        return true;
    }
    getRandomSolution() {
        throw new Error("Method not implemented.");
    }
    mutateSolution(solution: Solution) {
        throw new Error("Method not implemented.");
    }
    crossoverSolution(sol1: Solution, solution: Solution) {
        throw new Error("Method not implemented.");
    }
    setProblem(problem: Solution): void {
        throw new Error("Method not implemented.");
    }
    setRandomProblem(): void {
        throw new Error("Method not implemented.");
    }
    scoreSolution(solution: Solution): Number {
        throw new Error("Method not implemented.");
    }
}
