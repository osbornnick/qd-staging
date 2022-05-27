import BehaviorController from "../controller/BehaviorController";
import TaskController from "../controller/TaskController";
import GenBehaviorController from "../BehaviorImpl/GenBehaviorController";
import TSPTaskController from "./TSPTaskController";
import Manager from "../manager/Manager";
import { clamp } from "../util/util";
import ShortestEdgeBehavior from "./ShortestEdgeBehavior";
import LongestEdgeBehavior from "./LongestEdgeBehavior";
import GenManager from "../manager/GenManager";
import solutions from "./solutions.json";

export default class TSPManager extends GenManager implements Manager {
    constructor() {
        super();
        this.taskController = this.initTask();
        this.behaviorController = this.initBehavior();
        if (this.solutionsVisible) this.showSolutions();
        this.sendLog("start", { behavior_visible: this.behaviorVisible });
        this.sendLog("problem", {
            problem: this.taskController.model.getProblem(),
        });
        this.requestRandomSolution();
        this.solver = this.makeSolver();
        this.initUI();
    }

    protected initTask = (): TaskController => {
        let taskOnCanvas = this.makeCanvas(480);
        let taskOffCanvas = this.makeCanvas(480);

        let taskController = new TSPTaskController(
            taskOnCanvas,
            taskOffCanvas,
            window.requestAnimationFrame,
            this.onNewSolution,
            () => this.currentSolution.slice()
        );
        document.getElementById("taskCanvasParent")?.appendChild(taskOnCanvas);
        return taskController;
    };

    protected initBehavior = (): BehaviorController => {
        let behaviorOnCanvas = this.makeCanvas(250);
        let behaviorOffCanvas = this.makeCanvas(250);

        let behaviorController = new GenBehaviorController(
            behaviorOnCanvas,
            behaviorOffCanvas,
            window.requestAnimationFrame,
            this.onNewSolution,
            this.crossoverSolution,
            () => this.currentScore,
            this.taskController.model.isMinimize
        );
        const bcm = behaviorController.model;
        bcm.behavior1 = new ShortestEdgeBehavior();
        bcm.behavior2 = new LongestEdgeBehavior();
        this.taskController.view.indexColors = this.generateColorFn(
            bcm.behavior1.behaviorDefining,
            bcm.behavior2.behaviorDefining
        );

        document
            .getElementById("behaviorCanvasParent")
            ?.appendChild(behaviorOnCanvas);
        return behaviorController;
    };

    // lets implement this in the taskView, just passing the behavior def functions
    private generateColorFn = (
        behaviorDefining1: Function,
        behaviorDefining2: Function
    ): Function => {
        return () => [
            behaviorDefining1(
                this.taskController.model.getProblem(),
                this.currentSolution
            ),
            behaviorDefining2(
                this.taskController.model.getProblem(),
                this.currentSolution
            ),
        ];
    };

    initUI = () => {
        let instructionElement = document.getElementById("gameinstructions");
        if (instructionElement !== null)
            instructionElement.innerHTML =
                this.taskController.model.getInstructions();

        let behaviorInstructionElement = document.getElementById(
            "behaviorinstructions"
        );
        this.behaviorController.model.instructions =
            "The grid (below) will keep track of the routes you've found based on the length of their longest and shortests legs. Your current route is a blue dot. Grids cells that you have found a route in are shaded blue. Filling in the grid may help find different and shorter routes!<br> <b>Click a grid cell</b> to copy the best route from that cell. <br><b>Click and drag</b> between two grid cells to combine their best routes.";
        if (behaviorInstructionElement !== null)
            behaviorInstructionElement.innerHTML =
                this.behaviorController.model.instructions;

        let behavior1name = document.getElementById("behavior1title");
        if (behavior1name !== null) {
            behavior1name.innerText +=
                " " + this.behaviorController.model.behavior1.description;
            // TODO: CHANGE WHERE THIS IS DEFINED
            behavior1name.style.color = "brown";
        }

        let behavior2name = document.getElementById("behavior2title");
        if (behavior2name !== null) {
            behavior2name.innerText +=
                " " + this.behaviorController.model.behavior2.description;
            // TODO: CHANGE WHERE THIS IS DEIFNED
            behavior2name.style.color = "purple";
        }

        const aim = document.getElementById("aim");
        if (aim !== null)
            aim.innerText = this.taskController.model.isMinimize()
                ? "Lower"
                : "Higher";
    };

    updateUI = (score: number) => {
        let bonusCents = clamp(
            Math.round(100 * Math.pow((250000 - this.bestScore) / 250000, 2)),
            0,
            100
        );
        let bonusCode =
            (100 + 5 * bonusCents).toString(16) +
            "x" +
            ((bonusCents * 47) % 97).toString() +
            "x" +
            this.codeID;

        let bonusCodeElement = document.getElementById("bonuscode");
        if (bonusCodeElement !== null) bonusCodeElement.innerText = bonusCode;
        let bonusCentsElement = document.getElementById("bonuscents");
        if (bonusCentsElement !== null)
            bonusCentsElement.innerText =
                "$" + String((bonusCents / 100.0).toFixed(2));

        let currentScoreElement = document.getElementById("currentscore");
        if (currentScoreElement !== null)
            currentScoreElement.innerText = score.toFixed(0);

        let bestScoreElement = document.getElementById("bestscore");
        if (bestScoreElement !== null)
            bestScoreElement.innerText = this.bestScore.toFixed(0);
    };

    showSolutions = () => {
        if (this.behaviorVisible) {
        } else {
        }
    };
}
