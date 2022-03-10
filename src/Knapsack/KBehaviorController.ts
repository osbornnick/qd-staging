import BehaviorController from "../controller/BehaviorController";
import Controller from "../controller/Controller";
import BehaviorModel from "../model/BehaviorModel";
import BehaviorView from "../view/BehaviorView";

export default class KBehaviorController
    extends Controller
    implements BehaviorController
{
    model: BehaviorModel;
    view: BehaviorView;

    constructor(
        onScreenCanvas: HTMLCanvasElement,
        offScreenCanvas: HTMLCanvasElement,
        requestAnimationFrame: Function,
        onNewSolution: Function,
        requestCrossover: Function,
        getCurrentScore: Function
    ) {
        super(offScreenCanvas, onScreenCanvas);
    }
    registerMouseHandlers(): void {
        throw new Error("Method not implemented.");
    }
    registerButtonHandlers(): void {
        throw new Error("Method not implemented.");
    }
}
