import TaskModel from "./TaskModel";
import Problem from "../interfaces/Problem";
import Solution from "../interfaces/Solution";

export default class TSPModel implements TaskModel {
    problem: Problem;
    currentSolution: Solution;
    problemEdgeLengthMin: number = 999;
    problemEdgeLengthMax: number = 0;

    constructor() {
        this.setProblem([
            [0.0, 0.33],
            [0.0, 0.77],
            [0.13, 0.23],
            [0.13, 0.67],
            [0.17, 0.0],
            [0.17, 0.6],
            [0.2, 0.03],
            [0.2, 1.0],
            [0.27, 0.37],
            [0.27, 1.0],
            [0.3, 0.5],
            [0.3, 0.63],
            [0.37, 0.33],
            [0.37, 0.5],
            [0.37, 0.57],
            [0.43, 0.37],
            [0.47, 0.13],
            [0.47, 0.27],
            [0.5, 0.77],
            [0.53, 0.0],
            [0.53, 0.87],
            [0.6, 0.5],
            [0.63, 0.0],
            [0.63, 0.8],
            [0.67, 0.07],
            [0.67, 0.97],
            [0.7, 0.03],
            [0.7, 0.4],
            [0.7, 0.5],
            [0.7, 0.63],
            [0.7, 0.73],
            [0.7, 0.83],
            [0.73, 1.0],
            [0.77, 0.4],
            [0.87, 0.2],
            [0.87, 0.67],
            [0.93, 0.47],
            [0.97, 0.13],
            [0.97, 0.57],
            [1.0, 0.37],
        ]);
    }
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
    setProblem(problem: Problem): void {
        this.problem = problem;
        for (let ii = 0; ii < problem.length; ++ii) {
            for (let jj = ii + 1; jj < problem.length; ++jj) {
                let src = problem[ii];
                let dest = problem[jj];
                let dist = this.distance(src, dest);
                this.problemEdgeLengthMin = Math.min(
                    this.problemEdgeLengthMin,
                    dist
                );
                this.problemEdgeLengthMax = Math.max(
                    this.problemEdgeLengthMax,
                    dist
                );
            }
        }
    }
    private distance(p0: number[], p1: number[]): number {
        let distanceSqr =
            (p0[0] - p1[0]) * (p0[0] - p1[0]) +
            (p0[1] - p1[1]) * (p0[1] - p1[1]);
        return Math.sqrt(distanceSqr);
    }
    setSolution(solution: Solution): void {
        this.currentSolution = solution;
    }
    setRandomProblem(): void {
        throw new Error("Method not implemented.");
    }
    scoreSolution(solution: Solution): number {
        let score = 0;
        for (let ii = 0; ii < solution.length; ++ii) {
            let src = this.problem[solution[ii]];
            let dst = this.problem[solution[(ii + 1) % solution.length]];
            let dist = this.distance(src, dst);
            score += dist;
        }
        score *= 10000;
        return score;
    }
}
