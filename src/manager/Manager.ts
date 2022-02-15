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

    taskController: TaskController;
    behaviorController: BehaviorController;

    sendLog(type: String, info: {}): void;
    logTick(): void;
    chooseGame(): void;
    requestLastSolution(): void;
    requestBestSolution(): void;

    onNewSolution(type: String, solution: Solution): void;
}
