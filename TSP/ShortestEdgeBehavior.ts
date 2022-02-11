import Behavior from "../interfaces/Behavior.js";
import { distance } from "../util/util.js";

export default class ShortestEdgeBehavior implements Behavior {
    description: string;

    constructor() {
        this.description = "length of shortest edge";
    }
    // scaling needs to be here
    calculateBehavior(problem: number[][], solution: number[]): number {
        let minLength = 999.99;
        for (let ii = 0; ii < solution.length; ++ii) {
            let src = problem[solution[ii]];
            let dst = problem[solution[(ii + 1) % solution.length]];
            let dist = distance(src, dst);
            minLength = Math.min(minLength, dist);
        }
        return minLength;
    }
}
