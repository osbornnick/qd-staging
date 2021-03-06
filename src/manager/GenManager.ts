import GenBehaviorController from "../BehaviorImpl/GenBehaviorController";
import BehaviorController from "../controller/BehaviorController";
import TaskController from "../controller/TaskController";
import Solution from "../interfaces/Solution";
import { clamp } from "../util/util";
import Manager from "./Manager";
import Behavior from "../interfaces/Behavior";

export default class GenManager implements Manager {
    userID: String = "default";
    runID: String = "default";
    codeID: String = "default";
    behaviorVisible: boolean;
    solutionsVisible: boolean;
    bestSolution: Solution;
    previousSolution: Solution;
    currentSolution: Solution = [];
    currentScore: number = 0;
    bestScore: number = -1; // MAGIC NUMBER
    taskController: TaskController = <TaskController>{};
    behaviorController: BehaviorController = <BehaviorController>{};
    runIndex: number = 0;
    solver: any;

    constructor() {
        this.behaviorVisible = false;
        this.solutionsVisible = false;
        this.initUserID();

        this.registerButtonHandlers();
        // init
        this.runID = this.generateToken();
        this.codeID = this.runID.slice(1, 3);
        setInterval(this.logTick, 60000);
    }

    protected initTask = (): TaskController => {
        let taskOnCanvas = this.makeCanvas(480);
        let taskOffCanvas = this.makeCanvas(480);

        let taskController = <TaskController>{};
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
        behaviorController.model.behavior1 = <Behavior>{};
        behaviorController.model.behavior2 = <Behavior>{};
        document
            .getElementById("behaviorCanvasParent")
            ?.appendChild(behaviorOnCanvas);
        return behaviorController;
    };

    protected initUserID = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        let id = urlParams.get("uid");
        if (id !== null) this.userID = id;
        else {
            console.log("URL PARAMS ERROR, NO USER ID (WAHT DO?)");
        }
        // console.log("User id: ", this.userID);
        if (this.userID.charAt(this.userID.length - 2) == "1") {
            this.showBehavior();
            this.behaviorVisible = true;
        }

        if (this.userID.charAt(this.userID.length - 1) == "1") {
            this.showSolutions();
            this.solutionsVisible = true;
        }
    };

    protected registerButtonHandlers = () => {
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

        document
            .getElementById("solvetoggle")
            ?.addEventListener("click", () => this.toggleSolving());
    };

    sendLog = async (
        type: string,
        info: {},
        token: string = "",
        retries: number = 2,
        delay: number = 0
    ) => {
        if (delay > 0)
            await new Promise((resolve) => setTimeout(resolve, delay));
        if (token === "") token = this.generateToken();
        ++this.runIndex;
        let data = {
            time: Date.now(), // comes from client
            run: this.runID, // indicate a starting of the game (refresh gives new one)
            run_index: this.runIndex,
            user: this.userID,
            token,
            type,
            info,
        };
        fetch("/api/log", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(data),
        }).catch((err) => {
            console.log(err);
            if (retries > 0) this.sendLog(type, info, token, --retries, 1000);
        });
    };

    logTick = () => {
        this.sendLog("tick", {});
    };

    requestRandomSolution = () => {
        this.onNewSolution(
            "random",
            this.taskController.model.getRandomSolution()
        );
    };
    requestLastSolution = () => {
        this.onNewSolution("undo", this.previousSolution.slice());
    };
    requestBestSolution = () => {
        this.onNewSolution("best", this.bestSolution.slice());
    };
    requestMutateSolution = () => {
        this.onNewSolution(
            "mutate",
            this.taskController.model.mutateSolution(this.currentSolution)
        );
    };

    crossoverSolution = (sol1: Solution, sol2: Solution) => {
        let newSol = this.taskController.model.crossoverSolution(sol1, sol2);
        this.onNewSolution("crossover", newSol);
    };

    onNewSolution = (
        type: String,
        solution: any,
        shouldLog: boolean = true
    ) => {
        if (this.currentSolution.length == 0) {
            this.previousSolution = solution.slice();
        } else {
            this.previousSolution = this.currentSolution.slice();
        }
        this.currentSolution = solution.slice();
        // send solution to task model for scoring
        let score = this.taskController.model.scoreSolution(solution);
        this.currentScore = score;
        // solution sent w grade to behavior model for behavior scoring
        let behavior = this.behaviorController.model.evaluateSolution(
            this.taskController.model.problem,
            solution,
            score
        );
        this.taskController.view.draw();
        this.behaviorController.view.draw();

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

        if (shouldLog)
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

    // identifies a message (unique to each message)
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
                this.taskController.model.instructions;

        let behaviorInstructionElement = document.getElementById(
            "behaviorinstructions"
        );
        this.behaviorController.model.instructions =
            "behavior instructions go here";
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
    };

    updateUI = (score: number) => {
        let bonusCents = clamp(
            Math.round(100 * Math.pow((250000 - this.bestScore) / 250000, 2)),
            0,
            100
        );

        bonusCents = bonusCents > 50 ? 50 : bonusCents;

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

    showBehavior = () => {
        const behaviorElement = document.getElementById("behaviorcontent");
        if (behaviorElement !== null) behaviorElement.style.display = "block";
        const solverButton = document.getElementById("solvetoggle");
        if (solverButton !== null) solverButton.style.display = "block";
    };

    showSolutions = () => {
        // tell behavior to show solutions;
    };

    toggleSolving = () => {
        this.solver.toggleSolving();
    };

    makeSolver = () => {
        let tc = this.taskController;
        let bc = this.behaviorController;
        let manager = this;
        class Solver {
            i: number = 0;
            solving: Boolean = false;

            solve = async () => {
                while (this.solving) {
                    if (this.i < 100) manager.requestRandomSolution();
                    else {
                        let randomChoice = manager.randomMapChoice(
                            bc.model.binElites
                        );
                        let newSol;
                        let randomElite = bc.model.binElites.get(randomChoice);
                        let type;
                        if (Math.random() < 0.2) {
                            newSol = tc.model.mutateSolution(
                                randomElite.solution
                            );
                            type = "random solver";
                        } else {
                            let rand2 = manager.randomMapChoice(
                                bc.model.binElites
                            );
                            let rand2elite = bc.model.binElites.get(rand2);
                            newSol = tc.model.crossoverSolution(
                                randomElite.solution,
                                rand2elite.solution
                            );
                            type = "crossover solver";
                        }
                        manager.onNewSolution(type, newSol, false);
                        await new Promise((r) => setTimeout(r, 10));
                    }
                    this.i++;
                }
            };

            toggleSolving = () => {
                this.solving = !this.solving;
                this.solve();
            };
        }
        return new Solver();
    };

    randomMapChoice = (map: Map<String, any>) => {
        const keys = Array.from(map.keys());
        return keys[Math.floor(Math.random() * keys.length)];
    };
}
