import TaskModel from "../models/TaskModel";
import TaskView from "../views/TaskView";

export default interface TaskController {
    canvas: HTMLCanvasElement;
    model: TaskModel;
    view: TaskView;

    registerMouseHandlers(): void;
    registerButtonHandlers(): void;
}
