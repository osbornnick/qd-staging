import Behavior from "../interfaces/Behavior";
import { Problem, Solution } from "./KTaskModel";

export class SmallestWeightBehavior implements Behavior {
    description: string = "Weight of smallest coin";

    calculateBehavior(problem: Problem, solution: Solution): number {
        let min = 0;
        problem.coins.forEach((c, i) => {
            if (min === 0 && solution[i] === 1) min = c[0];
            if (solution[i] === 1) min = Math.min(c[0], min);
        });
        return this.scaleBehavior(problem, min);
    }

    scaleBehavior = (problem: Problem, b: number) => {
        let maxWeight = problem.coins[0][0];
        let minWeight = problem.coins[0][0];
        problem.coins.forEach((c) => {
            maxWeight = Math.max(maxWeight, c[0]);
            minWeight = Math.min(minWeight, c[0]);
        });
        return this.lremapClamp(b, minWeight, maxWeight);
    };

    lremapClamp(x: number, lo: number, hi: number) {
        return Math.max(0.0, Math.min(1.0, (x - lo) / (hi - lo)));
    }
}
