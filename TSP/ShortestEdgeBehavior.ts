import Behavior from "../interfaces/Behavior.js";
import { distance } from "../util/util.js";

export default class ShortestEdgeBehavior implements Behavior {
    description: string;

    constructor() {
        this.description = "length of shortest edge";
    }
    calculateBehavior(problem: number[][], solution: number[]): number {
        let min = distance(problem[solution[0]], problem[solution[1]]);
        for (let ii = 1; ii < solution.length; ++ii) {
            let src = problem[solution[ii]];
            let dst = problem[solution[(ii + 1) % solution.length]];
            let dist = distance(src, dst);
            min = Math.min(min, dist);
        }
        return min;
    }
}
