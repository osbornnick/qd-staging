import BehaviorController from "../controller/BehaviorController";
import TaskController from "../controller/TaskController";
import KTaskController from "./KTaskController";
import Manager from "../manager/Manager";
import { clamp, scale } from "../util/util";
import GenBehaviorController from "../BehaviorImpl/GenBehaviorController";
import { SmallestWeightBehavior } from "./SmallestWeightBehavior";
import { LargestWeightBehavior } from "./LargestWeightBehavior";
import GenManager from "../manager/GenManager";

export default class TSPManager extends GenManager implements Manager {
    constructor() {
        super();
        this.taskController = this.initTask();
        this.behaviorController = this.initBehavior();
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

        let taskController = new KTaskController(
            taskOnCanvas,
            taskOffCanvas,
            window.requestAnimationFrame,
            this.onNewSolution,
            () => this.currentSolution.slice()
        );
        document.getElementById("taskCanvasParent")?.appendChild(taskOnCanvas);
        this.registerAdditionalButtonHandlers();
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
        behaviorController.model.behavior1 = new SmallestWeightBehavior();
        behaviorController.model.behavior2 = new LargestWeightBehavior();
        document
            .getElementById("behaviorCanvasParent")
            ?.appendChild(behaviorOnCanvas);
        return behaviorController;
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
            "The grid (below) will keep track of solutions you've found. Your current route is a white-outlined dot. Grid cells that you have found a solution in are shaded in based on how good that solution is. Filling in the grid may help find different and better solutions! <br> <b>Click a grid cell</b> to copy the best solution from that cell. <br><b>Click and drag</b> between two grid cells to combine their best solutions.";
        if (behaviorInstructionElement !== null)
            behaviorInstructionElement.innerHTML =
                this.behaviorController.model.instructions;

        let behavior1name = document.getElementById("behavior1title");
        if (behavior1name !== null)
            behavior1name.innerText +=
                " " + this.behaviorController.model.behavior1.description;

        let behavior2name = document.getElementById("behavior2title");
        if (behavior2name !== null)
            behavior2name.innerText +=
                " " + this.behaviorController.model.behavior2.description;
        const aim = document.getElementById("aim");
        if (aim !== null)
            aim.innerText = this.taskController.model.isMinimize()
                ? "Lower"
                : "Higher";
    };

    updateUI = (score: number) => {
        // scale to 700 (magic number w.r.t the current problem)
        let bonusCents = clamp(
            Math.round(100 * scale(this.bestScore, 0, 700)),
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

    registerAdditionalButtonHandlers = () => {
        let clearSelectionElement = document.getElementById(
            "clearSelectionButton"
        );
        if (clearSelectionElement !== null)
            clearSelectionElement.addEventListener("click", () => {
                this.onNewSolution("manual", [], true);
            });
    };
}
