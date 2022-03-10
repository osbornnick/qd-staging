import Behavior from "../interfaces/Behavior";
import { Problem, Solution } from "./KTaskModel";

export class LargestWeightBehavior implements Behavior {
    description: string = "Weight of largest coin";

    calculateBehavior(problem: Problem, solution: Solution): number {
        let max = 0;
        problem.coins.forEach((c, i) => {
            if (solution[i] === 1) max = Math.max(c[0], max);
        });
        return max;
    }
}
