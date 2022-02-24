import BehaviorController from "../controller/BehaviorController";
import BehaviorModel from "../model/BehaviorModel";
import Controller from "../controller/Controller";
import BehaviorView from "../view/BehaviorView";
import TSPBehaviorModel from "./TSPBehaviorModel";
import TSPBehaviorView from "./TSPBehaviorView";

export default class TSPBehaviorController
    extends Controller
    implements BehaviorController
{
    model: BehaviorModel;
    view: BehaviorView;
    onNewSolution: Function;
    requestCrossover: Function;

    constructor(
        onScreenCanvas: HTMLCanvasElement,
        offScreenCanvas: HTMLCanvasElement,
        requestAnimationFrame: Function,
        onNewSolution: Function,
        requestCrossover: Function,
        getScoreRange: Function
    ) {
        super(offScreenCanvas, onScreenCanvas);
        this.requestCrossover = requestCrossover;
        this.model = new TSPBehaviorModel();
        let scale = 1;
        let modelGetters = {
            getNumBins: () => this.model.numBins,
            getBinElites: () => this.model.binElites,
            getSolutionBehavior: () => this.model.currentBehavior,
            getSolutionBin: () => this.model.currentBin,
            getScoreRange,
        };
        this.view = new TSPBehaviorView(
            offScreenCanvas.getContext("2d") || new CanvasRenderingContext2D(),
            this.render(requestAnimationFrame),
            modelGetters,
            offScreenCanvas.width,
            offScreenCanvas.height,
            scale
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
            "mousemove",
            this.view.handleMouseMove
        );
        this.onScreenCanvas.addEventListener(
            "mouseleave",
            this.view.handleMouseLeave
        );
        this.onScreenCanvas.addEventListener("mouseup", this.handleMouseUp);
    };

    handleMouseUp = (evt: MouseEvent) => {
        let crossObj = this.view.handleMouseUp(evt);
        if (crossObj == null) return;
        if (crossObj.crossover) {
            let sol1 = this.model.binElites.get(
                crossObj.binKey1.toString()
            ).solution;
            let sol2 = this.model.binElites.get(
                crossObj.binKey2.toString()
            ).solution;
            this.requestCrossover(sol1, sol2);
        } else {
            let sol = this.model.binElites.get(
                crossObj.binKey.toString()
            ).solution;
            this.onNewSolution("elite", sol);
        }
    };
    registerButtonHandlers(): void {
        throw new Error("Method not implemented.");
    }
}
