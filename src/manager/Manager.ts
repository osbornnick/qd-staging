import BehaviorController from "../controller/BehaviorController";
import TaskController from "../controller/TaskController";
import Solution from "../interfaces/Solution";

export default interface Manager {
    userID: String;
    behaviorVisible: boolean;
    bestSolution: Solution;
    previousSolution: Solution;
    currentSolution: Solution;
    bestScore: number | null;

    taskController: TaskController | null;
    behaviorController: BehaviorController | null;

    sendLog(type: String, info: {}): void;
    logTick(): void;
    requestLastSolution(): void;
    requestBestSolution(): void;

    onNewSolution(type: String, solution: Solution): void;
}
