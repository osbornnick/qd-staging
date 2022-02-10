import TaskModel from "../model/TaskModel.js";
import TaskView from "../view/TaskView.js";

export default interface TaskController {
    offScreenCanvas: HTMLCanvasElement;
    onScreenCanvas: HTMLCanvasElement;
    model: TaskModel;
    view: TaskView;
    getSolution: Function;

    registerMouseHandlers(): void;
    registerButtonHandlers(): void;
}
