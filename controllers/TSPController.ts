import TaskModel from "../models/TaskModel.js";
import TaskView from "../views/TaskView.js";
import Controller from "./Controller.js";

import TSPModel from "../models/TSPModel.js";
import TSPView from "../views/TSPView.js";
import Solution from "../interfaces/Solution.js";

// TODO: update canvas after writes to off screen context
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

    registerMouseHandlers(): void {
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
    }

    handleTaskMouseUp(event: MouseEvent): void {
        let newSol = this.view.handleMouseUp(event);
        this.updateSolution(newSol);
    }

    updateSolution(sol: Solution) {
        this.model.updateSolution(sol);
        this.onNewSolution();
    }

    registerButtonHandlers(): void {
        throw new Error("Method not implemented.");
    }

    // wrap window.requestAnimationFrame
    render(requestAnimationFrame: Function): Function {
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
    }
}
