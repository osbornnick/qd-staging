import Behavior from "../interfaces/Behavior";
import Solution from "../interfaces/Solution";
import Problem from "../interfaces/Problem";

export default interface BehaviorModel {
    binElites: Map<String, Solution>;
    currentBehavior: number[];
    currentBin: number[];
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
    getInstructions(): string;
    getEliteScoreRange(): number[];
}
