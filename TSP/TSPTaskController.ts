import TaskModel from "../model/TaskModel.js";
import TaskView from "../view/TaskView.js";
import TaskController from "../controller/TaskController.js";

import TSPModel from "./TSPTaskModel.js";
import TSPView from "./TSPTaskView.js";
import Controller from "../controller/Controller.js";

export default class TSPTaskController
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
        this.model = new TSPModel(); // initialized with random solution

        this.view = new TSPView(
            offScreenCanvas.getContext("2d") || new CanvasRenderingContext2D(), // workaround
            this.model.getProblem,
            getSolution,
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
        if (newSol !== null) {
            let combined = this.model.updateSolution(
                this.getSolution(),
                newSol
            );
            this.onNewSolution("user input", combined.slice());
        }
    };
    registerButtonHandlers(): void {
        throw new Error("Method not implemented.");
    }
}
