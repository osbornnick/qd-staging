import Solution from "./Solution";
import Problem from "./Problem";

export default interface Behavior {
    description: string;

    calculateBehavior(problem: Problem, solution: Solution): number;
    behaviorDefining(problem: Problem, solution: Solution): number;
}
