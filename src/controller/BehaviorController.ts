import BehaviorModel from "../model/BehaviorModel";
import BehaviorView from "../view/BehaviorView";

export default interface BehaviorController {
    model: BehaviorModel;
    view: BehaviorView;

    registerMouseHandlers(): void;
    registerButtonHandlers(): void;
}