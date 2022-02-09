import TaskModel from "../model/TaskModel.js";
import TaskView from "../view/TaskView.js";
import TaskController from "../controller/TaskController.js";

import TSPModel from "./TSPModel.js";
import TSPView from "./TSPView.js";
import Solution from "../interfaces/Solution.js";
import Controller from "../controller/Controller.js";

export default class TSPTaskController
    extends Controller
    implements TaskController
{
    onNewSolution: Function;
    model: TaskModel;
    view: TaskView;

    constructor(
        onScreenCanvas: HTMLCanvasElement,
        offScreenCanvas: HTMLCanvasElement,
        requestAnimationFrame: Function,
        onNewSolution: Function
    ) {
        super(offScreenCanvas, onScreenCanvas);
        this.model = new TSPModel();
        this.model.setSolution(this.model.getRandomSolution());

        this.view = new TSPView(
            offScreenCanvas.getContext("2d") || new CanvasRenderingContext2D(), // workaround
            this.model.getProblem,
            this.model.getSolution,
            this.render(requestAnimationFrame),
            offScreenCanvas.height,
            offScreenCanvas.width
        );
        this.onNewSolution = onNewSolution;
        this.registerMouseHandlers();
    }

    registerMouseHandlers = () => {
        this.onScreenCanvas.addEventListener(
            "mousedown",
            this.view.handleMouseDown
        );
        this.onScreenCanvas.addEventListener(
            "mouseleave",
            this.view.handleMouseLeave
        );
        this.onScreenCanvas.addEventListener(
            "mousemove",
            this.view.handleMouseMove
        );
        this.onScreenCanvas.addEventListener("mouseup", this.handleTaskMouseUp);
    };

    handleTaskMouseUp = (event: MouseEvent) => {
        let newSol = this.view.handleMouseUp(event);
        if (newSol !== null) this.updateSolution(newSol);
    };

    updateSolution = (sol: Solution) => {
        this.model.updateSolution(sol);
        this.onNewSolution();
    };

    registerButtonHandlers(): void {
        throw new Error("Method not implemented.");
    }
}
