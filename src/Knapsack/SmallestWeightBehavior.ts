import Behavior from "../interfaces/Behavior";
import { Problem, Solution } from "./KTaskModel";

export class SmallestWeightBehavior implements Behavior {
    description: string = "Weight of smallest coin";

    calculateBehavior(problem: Problem, solution: Solution): number {
        let min = 1000000;
        problem.coins.forEach((c, i) => {
            if (solution[i] === 1) min = Math.min(c[0], min);
        });
        return min;
    }
}
