import TaskModel from "../model/TaskModel";
import Problem from "../interfaces/Problem";
import Solution from "../interfaces/Solution";
import { distance } from "../util/util";

export default class TSPModel implements TaskModel {
    problem: Problem;
    // problemEdgeLengthMin: number = 999;
    // problemEdgeLengthMax: number = 0;

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
        return "You are given a map of multiple cities. Your goal is to find the shortest route that connects them all. The dots on the map represent cities and the lines represent legs of the route. <br> <b>Click and drag</b> between multiple cities to update the legs of the route.";
    }
    isMinimize(): boolean {
        return true;
    }
    shuffle = (array: number[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    getRandomSolution: Solution = () => {
        let newSol = [];
        for (let ii = 0; ii < this.problem.length; ++ii) {
            newSol.push(ii);
        }
        this.shuffle(newSol);

        return newSol;
    };

    mutateSolution(solution: Solution): Solution {
        let newSol = solution.slice();
        let ii = Math.floor(Math.random() * newSol.length);
        let jj = Math.floor(Math.random() * ii);
        [newSol[ii], newSol[jj]] = [newSol[jj], newSol[ii]];
        return newSol;
    }

    crossoverSolution(sol1: Solution, sol2: Solution): Solution {
        let length = sol1.length;
        let crossstart = Math.floor(Math.random() * length);
        let crosslength = Math.floor(Math.random() * (length - 1));
        let child = [];
        for (let ii = 0; ii < crosslength; ++ii) {
            let val = sol1[(crossstart + ii) % length];
            child.push(val);
        }
        for (let ii = 0; ii < length; ++ii) {
            let val = sol2[ii];
            if (child.indexOf(val) == -1) {
                child.push(val);
            }
        }
        return child;
    }

    setProblem = (problem: Problem) => {
        this.problem = problem.slice();
        // for (let ii = 0; ii < problem.length; ++ii) {
        //     for (let jj = ii + 1; jj < problem.length; ++jj) {
        //         let src = problem[ii];
        //         let dest = problem[jj];
        //         let dist = distance(src, dest);
        //         this.problemEdgeLengthMin = Math.min(
        //             this.problemEdgeLengthMin,
        //             dist
        //         );
        //         this.problemEdgeLengthMax = Math.max(
        //             this.problemEdgeLengthMax,
        //             dist
        //         );
        //     }
        // }
    };

    getProblem: Problem = () => this.problem.slice();

    updateSolution = (oldSol: Solution, newSol: Solution) => {
        oldSol = oldSol.slice();
        let startFrom = oldSol.indexOf(newSol[0]);
        for (let ii = 0; ii < oldSol.length; ++ii) {
            let val = oldSol[(startFrom + ii) % oldSol.length];
            if (newSol.indexOf(val) == -1) {
                newSol.push(val);
            }
        }
        return newSol;
    };

    setRandomProblem(): void {
        throw new Error("Method not implemented.");
    }

    scoreSolution(solution: Solution): number {
        let score = 0;
        for (let ii = 0; ii < solution.length; ++ii) {
            let src = this.problem[solution[ii]];
            let dst = this.problem[solution[(ii + 1) % solution.length]];
            let dist = distance(src, dst);
            score += dist;
        }
        score *= 10000;
        return score;
    }

    isValidSolution = (solution: Solution) => true;
}
