import TaskModel from "../model/TaskModel";
import TaskView from "../view/TaskView";

export default interface TaskController {
    offScreenCanvas: HTMLCanvasElement;
    onScreenCanvas: HTMLCanvasElement;
    model: TaskModel;
    view: TaskView;
    getSolution: Function;

    registerMouseHandlers(): void;
    registerButtonHandlers(): void;
}
