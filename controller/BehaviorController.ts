import BehaviorModel from "../model/BehaviorModel.js";
import BehaviorView from "../view/BehaviorView.js";

export default interface BehaviorController {
    model: BehaviorModel;
    view: BehaviorView;

    registerMouseHandlers(): void;
    registerButtonHandlers(): void;
}
