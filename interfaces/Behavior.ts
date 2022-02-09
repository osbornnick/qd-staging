import Solution from "./Solution.js";

export default interface Behavior {
    name: string;

    calculateBehavior(solution: Solution): number;
}
