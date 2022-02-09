import Solution from "./Solution.js";
import Problem from "./Problem.js";

export default interface Behavior {
    description: string;

    calculateBehavior(problem: Problem, solution: Solution): number;
}
