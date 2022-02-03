import Task from "./Task";
import Behavior from "./Behavior";

export default interface Engine {
    visibleProblemCanvas: HTMLElement;
    visibleBehaviorCanvas: HTMLElement;
    hiddenProblemcanvas: HTMLElement;
    hiddenBehaviorCanvas: HTMLElement;
    userID: string;
    behaviorVisible: boolean;
    task: Task;
    behavior: Behavior;

    setTask(task: Task): void;
    setBehavior(behavior: Behavior): void;
    onNewSolution(
        solution: number[][],
        score: number,
        behavior: number[],
        type: string
    ): void;
    sendLog(type: string, info: {}): void;
    requestRandomSolution(): void;
    requestLastSolution(): void;
    requestBestSolution(): void;
    renderTask(drawFn: Function): void;
    renderBehavior(drawFn: Function): void;
    logTick(): void;
}
