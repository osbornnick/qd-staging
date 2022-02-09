import Behavior from "../interfaces/Behavior.js";
import Solution from "../interfaces/Solution.js";
import Problem from "../interfaces/Problem.js";

export default interface BehaviorModel {
    binElites: Map<String, Solution>;
    currentBehavior: number[];
    currentIsNewElite: boolean;
    numBins: number;
    behavior1: Behavior;
    behavior2: Behavior;

    evaluateSolution(
        problem: Problem,
        solution: Solution,
        solutionScore: number
    ): number[];
    setBins(bins: number): void;
    setBehavior1(b: Behavior): void;
    setBehavior2(b: Behavior): void;
    getCurrentIsNewElite(): boolean;
}
