import Behavior from "../interfaces/Behavior.js";
import { distance } from "../util/util.js";

export default class LongestEdgeBehavior implements Behavior {
    description: string;

    constructor() {
        this.description = "length of longest edge";
    }
    // scaling needs to be here
    calculateBehavior(problem: number[][], solution: number[]): number {
        let maxLength = 0;
        for (let ii = 0; ii < solution.length; ++ii) {
            let src = problem[solution[ii]];
            let dst = problem[solution[(ii + 1) % solution.length]];
            let dist = distance(src, dst);
            maxLength = Math.max(maxLength, dist);
        }
        return maxLength;
    }
}
