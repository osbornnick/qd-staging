import Task from "../model/TaskModel";

export type Problem = {
    coins: number[][];
    capacity: number;
};

export type Solution = number[];

export default class KTaskModel implements Task {
    // problem object
    // each i indice in problem represents a coin, with [i][0] being its weight and [i][1] its value
    // a solution is an array of 1s and 0s, where the ith value represents inclusion or exclusion of a coin
    problem: Problem = { coins: [[]], capacity: 0 }; // coins as x,y,area?

    constructor() {
        this.problem = {
            coins: [
                [10, 48],
                [30, 30],
                [12, 42],
                [22, 36],
                [12, 22],
                [20, 43],
                [9, 18],
                [18, 36],
                [18, 36],
                [20, 29],
                [25, 30],
                [25, 30],
                [18, 25],
                [7, 19],
                [16, 41],
                [16, 41],
                [24, 34],
                [24, 34],
                [21, 32],
                [21, 27],
                [21, 27],
                [32, 24],
                [32, 24],
                [9, 18],
                [9, 18],
            ],
            capacity: 100,
        };
    }

    getName = (): string => {
        return "Knapsack problem";
    };
    getObjectiveName(): string {
        throw new Error("Method not implemented.");
    }
    getInstructions(): string {
        throw new Error("Method not implemented.");
    }
    isMinimize = (): boolean => {
        return false;
    };
    isValidSolution = (sol: number[]): boolean => {
        let weight = 0;
        for (let i = 0; i < sol.length; i++)
            weight += this.problem.coins[sol[i]][0];
        if (weight <= this.problem.capacity) return true;
        return false;
    };
    getRandomSolution = () => {
        // list from 0 to n-1
        // shuffle list
        // add coins until I can't anymore
        let sol: number[] = [];
        let totalWeight = 0;
        let coinList = [];
        for (let i = 0; i < this.problem.coins.length; i++) {
            coinList.push(i);
        }
        this.shuffleArray(coinList);
        let i = 0;
        while (totalWeight + coinList[i] <= this.problem.capacity) {
            sol.push(coinList[i]);
            totalWeight += this.problem.coins[coinList[i]][0];
            i++;
        }
        return sol;
    };

    // from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    shuffleArray(array: number[]) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
    mutateSolution(solution: Solution) {
        throw new Error("Method not implemented.");
    }
    crossoverSolution(sol1: Solution, sol2: Solution) {
        throw new Error("Method not implemented.");
    }
    setProblem = (problem: Problem): void => {
        this.problem = problem;
    };
    getProblem = () => {
        return this.problem;
    };
    updateSolution(oldSol: Solution, newSol: Solution) {
        throw new Error("Method not implemented.");
    }
    setRandomProblem(): void {
        throw new Error("Method not implemented.");
    }
    scoreSolution(solution: any): number {
        let score = 0;
        for (let i = 0; i < solution.length; i++) {
            if (solution[i] == i) score += this.problem.coins[i][1];
        }
        return score;
    }

   
}
