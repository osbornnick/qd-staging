import Behavior from "../interfaces/Behavior.js";
import Solution from "../interfaces/Solution.js";

export default interface BehaviorModel {
    binElites: null;
    currentBehavior: number[];
    numBins: number;
    behavior1: Behavior;
    behavior2: Behavior;

    evaluateSolution(solution: Solution): number[];
    setBins(bins: number): void;
}
