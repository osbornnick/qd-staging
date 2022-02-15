import Behavior from "../interfaces/Behavior.js";
import { distance } from "../util/util.js";
import Problem from "../interfaces/Problem.js";
import Solution from "../interfaces/Solution.js";

export default class LongestEdgeBehavior implements Behavior {
    description: string;

    constructor() {
        this.description = "length of longest edge";
    }
    // scaling needs to be here
    calculateBehavior(problem: Problem, solution: Solution): number {
        let maxLength = 0;
        for (let ii = 0; ii < solution.length; ++ii) {
            let src = problem[solution[ii]];
            let dst = problem[solution[(ii + 1) % solution.length]];
            let dist = distance(src, dst);
            maxLength = Math.max(maxLength, dist);
        }
        return this.scaleMaxLength(problem, maxLength);
    }

    lremapClamp(x: number, lo: number, hi: number) {
        return Math.max(0.0, Math.min(1.0, (x - lo) / (hi - lo)));
    }

    private scaleMaxLength = (problem: Problem, longestEdge: number) => {
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
        return this.lremapClamp(longestEdge, mid, problemMax);
    };
}
