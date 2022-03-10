import Behavior from "../interfaces/Behavior";
import { distance } from "../util/util";
import Problem from "../interfaces/Problem";
import Solution from "../interfaces/Solution";

export default class LongestEdgeBehavior implements Behavior {
    description: string;

    constructor() {
        this.description = "length of longest edge";
    }
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

    behaviorDefining(problem: Problem, solution: Solution) {
        let rtn = 0;
        let maxLength = 0;
        for (let ii = 0; ii < solution.length; ++ii) {
            let src = problem[solution[ii]];
            let dst = problem[solution[(ii + 1) % solution.length]];
            let dist = distance(src, dst);
            if (dist > maxLength) {
                maxLength = dist;
                rtn = solution[ii];
            }
        }
        return rtn;
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
