import { request } from "http";
import Controller from "../controller/Controller";
import TaskController from "../controller/TaskController";
import TaskModel from "../model/TaskModel";
import TaskView from "../view/TaskView";
import KTaskModel from "./KTaskModel";
import { KTaskView } from "./KTaskView";

export default class KTaskController
    extends Controller
    implements TaskController
{
    onNewSolution: Function;
    model: TaskModel;
    view: TaskView;
    getSolution: Function;

    constructor(
        onScreenCanvas: HTMLCanvasElement,
        offScreenCanvas: HTMLCanvasElement,
        requestAnimationFrame: Function,
        onNewSolution: Function,
        getSolution: Function
    ) {
        super(offScreenCanvas, onScreenCanvas);
        this.getSolution = getSolution;
        this.onNewSolution = onNewSolution;
        this.model = new KTaskModel();
        this.view = new KTaskView(
            offScreenCanvas.getContext("2d") || new CanvasRenderingContext2D(),
            this.model.getProblem,
            getSolution,
            this.render(requestAnimationFrame),
            onScreenCanvas.height,
            onScreenCanvas.width
        );
        this.registerMouseHandlers();
    }
    registerMouseHandlers = (): void => {
        this.onScreenCanvas.addEventListener(
            "mousemove",
            this.view.handleMouseMove
        );
    };
    registerButtonHandlers(): void {
        throw new Error("Method not implemented.");
    }
}
