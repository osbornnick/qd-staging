import TaskModel from "../models/TaskModel.js";
import TaskView from "../views/TaskView.js";

export default interface TaskController {
    offScreenCanvas: HTMLCanvasElement;
    onScreenCanvas: HTMLCanvasElement;
    model: TaskModel;
    view: TaskView;

    registerMouseHandlers(): void;
    registerButtonHandlers(): void;
}
