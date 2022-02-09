import BehaviorController from "../controller/BehaviorController.js";
import BehaviorModel from "../model/BehaviorModel.js";
import BehaviorView from "../view/BehaviorView.js";

export default class TSPBehaviorController implements BehaviorController {
    offScreenCanvas: HTMLCanvasElement;
    onScreenCanvas: HTMLCanvasElement;
    model: BehaviorModel;
    view: BehaviorView;
    registerMouseHandlers(): void {
        throw new Error("Method not implemented.");
    }
    registerButtonHandlers(): void {
        throw new Error("Method not implemented.");
    }

}