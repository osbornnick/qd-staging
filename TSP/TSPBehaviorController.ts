import BehaviorController from "../controller/BehaviorController.js";
import BehaviorModel from "../model/BehaviorModel.js";
import Controller from "../controller/Controller.js";
import BehaviorView from "../view/BehaviorView.js";
import TSPBehaviorModel from "./TSPBehaviorModel.js";
import TSPBehaviorView from "./TSPBehaviorView.js";
import Solution from "../interfaces/Solution.js";
import Problem from "../interfaces/Problem.js";

export default class TSPBehaviorController
    extends Controller
    implements BehaviorController
{
    model: BehaviorModel;
    view: BehaviorView;
    onNewSolution: Function;

    constructor(
        onScreenCanvas: HTMLCanvasElement,
        offScreenCanvas: HTMLCanvasElement,
        requestAnimationFrame: Function,
        onNewSolution: Function
    ) {
        super(offScreenCanvas, onScreenCanvas);
        this.model = new TSPBehaviorModel();
        let modelGetters = {
            getNumBins: () => this.model.numBins,
            getBinElites: () => this.model.binElites,
            getSolutionBehavior: () => this.model.currentBehavior,
            getSolutionBin: () => this.model.currentBin,
        };
        this.view = new TSPBehaviorView(
            offScreenCanvas.getContext("2d") || new CanvasRenderingContext2D(),
            this.render(requestAnimationFrame),
            modelGetters,
            offScreenCanvas.width,
            offScreenCanvas.height,
            1
        );
        this.onNewSolution = onNewSolution;
        this.registerMouseHandlers();
    }

    updateSolution = (
        problem: Problem,
        solution: Solution,
        solutionScore: number
    ) => {
        this.model.evaluateSolution(problem, solution, solutionScore);
    };

    registerMouseHandlers = () => {
        this.onScreenCanvas.addEventListener(
            "mousedown",
            this.view.handleMouseDown
        );
    };
    registerButtonHandlers(): void {
        throw new Error("Method not implemented.");
    }
}
