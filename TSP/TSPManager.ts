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
    bestScore: number | null = null;
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
            .getElementById("behaviorCanvasParent")
            ?.appendChild(behaviorOnCanvas);

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

        this.registerButtonHandlers();
        // init
        this.requestRandomSolution();
    }

    private registerButtonHandlers = () => {
        document
            .getElementById("bestSolutionButton")
            ?.addEventListener("click", () => this.requestBestSolution());
        document
            .getElementById("lastSolutionButton")
            ?.addEventListener("click", () => this.requestLastSolution());
        document
            .getElementById("randomSolutionButton")
            ?.addEventListener("click", () => this.requestRandomSolution());
        document
            .getElementById("mutateSolutionButton")
            ?.addEventListener("click", () => this.requestMutateSolution());
    };

    sendLog(type: String, info: {}): void {
        throw new Error("Method not implemented.");
    }
    logTick(): void {
        throw new Error("Method not implemented.");
    }
    chooseGame(): void {
        throw new Error("Method not implemented.");
    }
    requestRandomSolution = () => {
        this.onNewSolution(
            "random",
            this.taskController.model.getRandomSolution()
        );
    };
    requestLastSolution = () => {
        this.onNewSolution("request last", this.previousSolution);
    };
    requestBestSolution = () => {
        this.onNewSolution("request best", this.bestSolution);
    };
    requestMutateSolution = () => {
        this.onNewSolution(
            "mutate solution",
            this.taskController.model.mutateSolution(this.currentSolution)
        );
    };

    crossoverSolution = (sol1: Solution, sol2: Solution) => {
        let newSol = this.taskController.model.crossoverSolution(sol1, sol2);
        this.onNewSolution("crossover", newSol);
    };

    onNewSolution = (type: String, solution: any) => {
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
        if (this.bestScore == null) {
            this.bestSolution = this.currentSolution.slice();
            this.bestScore = score;
        } else {
            if (
                this.taskController.model.isMinimize() &&
                score < this.bestScore
            ) {
                this.bestSolution = this.currentSolution.slice();
            } else if (
                !this.taskController.model.isMinimize() &&
                score > this.bestScore
            ) {
                this.bestSolution = this.currentSolution.slice();
            }
        }
    };

    makeCanvas(size: number) {
        let canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        return canvas;
    }
}
