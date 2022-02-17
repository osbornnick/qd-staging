import BehaviorController from "../controller/BehaviorController";
import TaskController from "../controller/TaskController";
import TSPBehaviorController from "./TSPBehaviorController";
import TSPTaskController from "./TSPTaskController";
import Manager from "../manager/Manager";
import Solution from "../interfaces/Solution";
import { clamp } from "../util/util";

export default class TSPManager implements Manager {
    userID: String = "default";
    codeID: String = "default";
    behaviorVisible: boolean;
    bestSolution: any;
    previousSolution: Solution;
    currentSolution: Solution = [[]];
    bestScore: number = -1; // MAGIC NUMBER
    taskController: TaskController;
    behaviorController: BehaviorController;
    runIndex: number = 0;

    constructor() {
        this.initUserID();
        this.behaviorVisible = true;

        let taskOnCanvas = this.makeCanvas(480);
        let taskOffCanvas = this.makeCanvas(480);
        let behaviorOnCanvas = this.makeCanvas(350);
        let behaviorOffCanvas = this.makeCanvas(350);

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
        this.codeID = this.generateToken().slice(1, 3);
        this.sendLog("start", { behavior_visible: this.behaviorVisible });
        this.sendLog("problem", {
            problem: this.taskController.model.getProblem(),
        });
        this.requestRandomSolution();
        this.initUI();
        setInterval(this.logTick, 60000);
    }

    private initUserID = () => {
        fetch("/api/id").then(async (res) => {
            let { id } = await res.json();
            this.userID = id;
        });
    };

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

    sendLog = (type: String, info: {}) => {
        ++this.runIndex;
        let runID = 0;
        let data = {
            time: Date.now(),
            run: runID,
            run_index: this.runIndex,
            user: this.userID,
            token: this.generateToken(),
            type: type,
            info,
        };
        fetch("/api/log", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(data),
        });
    };

    logTick = () => {
        this.sendLog("tick", {});
    };

    chooseGame(): void {
        this.initUI();
        throw new Error("Method not implemented.");
    }
    requestRandomSolution = () => {
        this.onNewSolution(
            "random",
            this.taskController.model.getRandomSolution()
        );
    };
    requestLastSolution = () => {
        this.onNewSolution("request last", this.previousSolution.slice());
    };
    requestBestSolution = () => {
        this.onNewSolution("request best", this.bestSolution.slice());
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
        if (this.bestScore == -1) {
            this.bestSolution = this.currentSolution.slice();
            this.bestScore = score;
        } else {
            if (
                this.taskController.model.isMinimize() &&
                score < this.bestScore
            ) {
                this.bestSolution = this.currentSolution.slice();
                this.bestScore = score;
            } else if (
                !this.taskController.model.isMinimize() &&
                score > this.bestScore
            ) {
                this.bestSolution = this.currentSolution.slice();
                this.bestScore = score;
            }
        }

        this.sendLog("solution", {
            solution: this.currentSolution,
            type,
            score,
            best_score: this.bestScore,
            behavior,
            behavior_bin: this.behaviorController.model.currentBin,
            arch_elite_count: this.behaviorController.model.binElites.size, //is this right?
            new_elite: this.behaviorController.model.currentIsNewElite,
        });
        this.updateUI(score);
    };

    makeCanvas(size: number) {
        let canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        return canvas;
    }

    generateToken() {
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        let text = "";
        for (let ii = 0; ii < 9; ++ii) {
            let rnd = crypto.getRandomValues(new Uint8Array(1))[0] / 255.0;
            text += possible.charAt(
                clamp(Math.floor(rnd * possible.length), 0, possible.length - 1)
            );
        }

        let check = 0;
        for (let ii = 0; ii < text.length; ++ii) {
            check += text.charCodeAt(ii);
        }
        text += (check % 16).toString(16).toUpperCase();

        return text;
    }

    initUI = () => {
        let instructionElement = document.getElementById("gameinstructions");
        if (instructionElement !== null)
            instructionElement.innerHTML =
                this.taskController.model.getInstructions();

        let behaviorInstructionElement = document.getElementById(
            "behaviorinstructions"
        );
        if (behaviorInstructionElement !== null)
            behaviorInstructionElement.innerHTML =
                this.behaviorController.model.getInstructions();
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
}
