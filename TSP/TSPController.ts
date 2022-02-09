import TaskModel from "../model/TaskModel.js";
import TaskView from "../view/TaskView.js";
import Controller from "../controller/Controller.js";

import TSPModel from "./TSPModel.js";
import TSPView from "./TSPView.js";
import Solution from "../interfaces/Solution.js";

export default class TSPController implements Controller {
    offScreenCanvas: HTMLCanvasElement;
    onScreenCanvas: HTMLCanvasElement;
    onNewSolution: Function;
    model: TaskModel;
    view: TaskView;

    constructor(
        onScreenCanvas: HTMLCanvasElement,
        offScreenCanvas: HTMLCanvasElement,
        requestAnimationFrame: Function,
        onNewSolution: Function
    ) {
        this.model = new TSPModel();
        this.model.setSolution(this.model.getRandomSolution());
        this.offScreenCanvas = offScreenCanvas;
        this.onScreenCanvas = onScreenCanvas;

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

    // wrap window.requestAnimationFrame
    render: Function = (requestAnimationFrame: Function) => {
        // return a fn that takes a fn as an argument, to addon some functionality to that function
        return (drawFn: Function) => {
            let drawAddon = () => {
                // call the given draw function, which draws to offscreen canvas
                // then copy that to the on screen canvas
                drawFn();
                let context = this.onScreenCanvas.getContext("2d");
                context?.clearRect(
                    0,
                    0,
                    this.onScreenCanvas.width,
                    this.onScreenCanvas.height
                );
                context?.drawImage(this.offScreenCanvas, 0, 0);
            };
            requestAnimationFrame(drawAddon);
        };
    };
}
