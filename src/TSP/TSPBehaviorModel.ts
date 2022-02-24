import Behavior from "../interfaces/Behavior";
import Problem from "../interfaces/Problem";
import BehaviorModel from "../model/BehaviorModel";
import LongestEdgeBehavior from "./LongestEdgeBehavior";
import ShortestEdgeBehavior from "./ShortestEdgeBehavior";
import Solution from "../interfaces/Solution";

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
        this.behavior1 = new ShortestEdgeBehavior();
        this.behavior2 = new LongestEdgeBehavior();
    }

    // needs to take isMinimize as an argument (for determining elite status)
    evaluateSolution = (
        problem: Problem,
        solution: Solution,
        solutionScore: number
    ): number[] => {
        let shortestEdge = this.behavior1.calculateBehavior(problem, solution);
        let longestEdge = this.behavior2.calculateBehavior(problem, solution);
        let evaluation = [shortestEdge, longestEdge];
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
        // isMinimize should be checked?
        if (binElite === undefined || binElite.score > solutionScore) {
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
    getEliteScoreRange = (): number[] => {
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
    getInstructions = () =>
        "The grid (below) will keep track of the routes you've found based on the length of their longest and shortests legs. Your current route is a blue dot. Grids cells that you have found a route in are shaded blue. Filling in the grid may help find different and shorter routes!<br> <b>Click a grid cell</b> to copy the best route from that cell. <br><b>Click and drag</b> between two grid cells to combine their best routes.";
}
