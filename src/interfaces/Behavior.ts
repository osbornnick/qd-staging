import Solution from "./Solution";
import Problem from "./Problem";

export default interface Behavior {
    description: string;

    calculateBehavior(problem: Problem, solution: Solution): number;
    // return the index of the solution property that defines this behavior
    behaviorDefining(problem: Problem, solution: Solution): number;
}
