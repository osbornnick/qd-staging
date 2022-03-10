import Behavior from "../interfaces/Behavior";
import BehaviorModel from "../model/BehaviorModel";
import { Solution } from "./KTaskModel";
import { LargestWeightBehavior } from "./LargestWeightBehavior";
import { SmallestWeightBehavior } from "./SmallestWeightBehavior";

export default class KBehaviorModel implements BehaviorModel {
    binElites: Map<String, { solution: Solution; score: number }> = new Map();
    currentBehavior: number[] = [];
    currentBin: number[] = [];
    currentIsNewElite: boolean = false;
    numBins: number = 10;
    behavior1: Behavior;
    behavior2: Behavior;

    // add an isminimize check
    constructor() {
        this.behavior1 = new SmallestWeightBehavior();
        this.behavior2 = new LargestWeightBehavior();
    }
    evaluateSolution = (
        problem: any,
        solution: any,
        solutionScore: number
    ): number[] => {
        let b1Measure = this.behavior1.calculateBehavior(problem, solution);
        let b2Measure = this.behavior2.calculateBehavior(problem, solution);
        let evaluation = [b1Measure, b2Measure];
        let behaviorBin = [
            Math.min(
                Math.floor(evaluation[0] * this.numBins),
                this.numBins - 1
            ),
            Math.min(
                Math.floor(evaluation[1] * this.numBins),
                this.numBins - 1
            ),
        ];
        this.currentBin = behaviorBin.slice();
        let binKey = behaviorBin.toString();
        let binElite = this.binElites.get(binKey);
        this.currentIsNewElite = false;
        // or score is better - need to check isMinimize
        if (binElite === undefined || binElite.score) {
            let newElite = {
                score: solutionScore,
                solution: solution.slice(),
            };
            this.binElites.set(binKey, newElite);
            this.currentIsNewElite = true;
        }
        this.currentBehavior = evaluation.slice();
        return evaluation;
    };
    setBins = (bins: number) => (this.numBins = bins);
    setBehavior1 = (b: Behavior) => (this.behavior1 = b);
    setBehavior2 = (b: Behavior) => (this.behavior2 = b);
    getCurrentIsNewElite = () => this.currentIsNewElite;
    getCurrentBehaviorBin = () => this.currentBin;
    getInstructions(): string {
        throw new Error("Method not implemented.");
    }
    getEliteScoreRange = (): number[] => {
        // needs to check isminimize
        let minScore = 0;
        let maxScore = 0;
        let i = 0;
        this.binElites.forEach((value, key) => {
            if (i === 0) {
                minScore = value.score;
                maxScore = value.score;
            } else {
                minScore = Math.min(minScore, value.score);
                maxScore = Math.max(maxScore, value.score);
            }
            i++;
        });
        return [minScore, maxScore];
    };
}
