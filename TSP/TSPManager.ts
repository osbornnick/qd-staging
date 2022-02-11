import BehaviorController from "../controller/BehaviorController.js";
import TaskController from "../controller/TaskController.js";
import TSPBehaviorController from "./TSPBehaviorController.js";
import TSPTaskController from "./TSPTaskController.js";
import Manager from "../manager/Manager.js";
import Solution from "../interfaces/Solution.js";

export default class TSPManager implements Manager {
    userID: String;
    behaviorVisible: boolean;
    bestSolution: any;
    previousSolution: Solution;
    currentSolution: Solution = [[]];
    bestScore: number = 0;
    taskController: TaskController;
    behaviorController: BehaviorController;

    constructor() {
        this.userID = "test";
        this.behaviorVisible = true;

        let taskOnCanvas = this.makeCanvas(540);
        let taskOffCanvas = this.makeCanvas(540);
        let behaviorOnCanvas = this.makeCanvas(540);
        let behaviorOffCanvas = this.makeCanvas(540);

        document.getElementById("taskCanvasParent")?.appendChild(taskOnCanvas);
        document
            .getElementById("offscreenTaskParent")
            ?.appendChild(taskOffCanvas);
        document
            .getElementById("behaviorCanvasParent")
            ?.appendChild(behaviorOnCanvas);
        document
            .getElementById("offscreenBehaviorParent")
            ?.appendChild(behaviorOffCanvas);

        this.taskController = new TSPTaskController(
            taskOnCanvas,
            taskOffCanvas,
            window.requestAnimationFrame,
            this.onNewSolution,
            () => this.currentSolution.slice()
        );
        this.behaviorController = new TSPBehaviorController(
            behaviorOnCanvas,
            behaviorOffCanvas,
            window.requestAnimationFrame,
            this.onNewSolution,
            this.crossoverSolution
        );

        // init
        this.onNewSolution(
            "random start",
            this.taskController.model.getRandomSolution()
        );
    }
    sendLog(type: String, info: {}): void {
        throw new Error("Method not implemented.");
    }
    logTick(): void {
        throw new Error("Method not implemented.");
    }
    chooseGame(): void {
        throw new Error("Method not implemented.");
    }
    requestLastSolution(): void {
        throw new Error("Method not implemented.");
    }
    requestBestSolution(): void {
        throw new Error("Method not implemented.");
    }

    crossoverSolution = (sol1: Solution, sol2: Solution) => {
        let newSol = this.taskController.model.crossoverSolution(sol1, sol2);
        this.onNewSolution("crossover", newSol);
    };

    onNewSolution = (type: String, solution: any) => {
        console.log("onNewSolution called with:", type, solution);
        this.previousSolution = this.currentSolution.slice();
        this.currentSolution = solution.slice();
        // send solution to task model for scoring
        let score = this.taskController.model.scoreSolution(solution);
        // solution sent w grade to behavior model for behavior scoring
        let behavior = this.behaviorController.model.evaluateSolution(
            this.taskController.model.problem,
            solution,
            score
        );
        this.taskController.view.draw();
        this.behaviorController.view.draw();
        // solution, problem, solutionScore, isAnElite, behaviorBin, behaviorScore, type sent to log
        // check if solution is the best one
        // taskController.model.isMinimize()
    };

    makeCanvas(size: number) {
        let canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        return canvas;
    }
}
