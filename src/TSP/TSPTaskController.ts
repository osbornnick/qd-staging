import TaskModel from "../model/TaskModel";
import TaskView from "../view/TaskView";
import TaskController from "../controller/TaskController";

import TSPModel from "./TSPTaskModel";
import TSPView from "./TSPTaskView";
import Controller from "../controller/Controller";

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
            this.onNewSolution("manual", combined.slice());
        }
    };
    registerButtonHandlers(): void {
        throw new Error("Method not implemented.");
    }
}
