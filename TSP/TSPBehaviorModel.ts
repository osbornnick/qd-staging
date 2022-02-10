import Behavior from "../interfaces/Behavior.js";
import Problem from "../interfaces/Problem.js";
import BehaviorModel from "../model/BehaviorModel.js";
import LongestEdgeBehavior from "./LongestEdgeBehavior.js";
import ShortestEdgeBehavior from "./ShortestEdgeBehavior.js";
import { distance } from "../util/util.js";
import Solution from "../interfaces/Solution.js";

export default class TSPBehaviorModel implements BehaviorModel {
    binElites: Map<String, { solution: Solution; score: number }> = new Map();
    currentBehavior: number[] = [];
    currentBin: number[] = [];
    currentIsNewElite: boolean = false;
    numBins: number = 10;
    behavior1: Behavior;
    behavior2: Behavior;

    constructor() {
        // default to this behavior.
        this.behavior1 = new LongestEdgeBehavior();
        this.behavior2 = new ShortestEdgeBehavior();
    }

    evaluateSolution = (problem: any, solution: any, solutionScore: number) => {
        let x = this.behavior1.calculateBehavior(problem, solution);
        let y = this.behavior2.calculateBehavior(problem, solution);
        let scaledEvaluation = this.scaleEvaluation(problem, x, y);

        let behaviorBin = [
            Math.min(
                Math.floor(scaledEvaluation[0] * this.numBins),
                this.numBins - 1
            ),
            Math.min(
                Math.floor(scaledEvaluation[1] * this.numBins),
                this.numBins - 1
            ),
        ];
        this.currentBin = behaviorBin.slice();
        let binKey = behaviorBin.toString();
        let binElite = this.binElites.get(binKey);
        this.currentIsNewElite = false;
        // isMinimize should be checked?
        if (binElite === undefined || binElite.score > solutionScore) {
            let newElite = {
                score: solutionScore,
                solution: solution.slice(),
            };
            this.binElites.set(binKey, newElite);
            this.currentIsNewElite = true;
        }

        this.currentBehavior = scaledEvaluation.slice();
        return scaledEvaluation;
    };

    private scaleEvaluation = (
        problem: Problem,
        shortest: number,
        longest: number
    ) => {
        let problemMin = 999.9;
        let problemMax = 0.0;
        for (var ii = 0; ii < problem.length; ++ii) {
            for (var jj = ii + 1; jj < problem.length; ++jj) {
                var src = problem[ii];
                var dst = problem[jj];
                var dist = distance(src, dst);
                problemMin = Math.min(problemMin, dist);
                problemMax = Math.max(problemMax, dist);
            }
        }
        let mid = 0.75 * problemMin + 0.25 * problemMax;
        return [
            this.lremapClamp(shortest, problemMin, mid),
            this.lremapClamp(longest, mid, problemMax),
        ];
    };

    setBins = (bins: number) => (this.numBins = bins);
    setBehavior1 = (b: Behavior) => (this.behavior1 = b);
    setBehavior2 = (b: Behavior) => (this.behavior2 = b);
    getCurrentIsNewElite = () => this.currentIsNewElite;
    getCurrentBehaviorBin = () => this.currentBin;

    lremapClamp(x: number, lo: number, hi: number) {
        return Math.max(0.0, Math.min(1.0, (x - lo) / (hi - lo)));
    }
}
