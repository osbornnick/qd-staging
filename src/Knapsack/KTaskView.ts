import { Problem, Solution } from "./KTaskModel";
import TaskView from "../view/TaskView";
import { scale, distanceSqr } from "../util/util";
import interpolate from "color-interpolate";

export class KTaskView implements TaskView {
    context: CanvasRenderingContext2D;
    render: Function;
    canvasWidth: number;
    canvasHeight: number;
    scale: number;
    getProblem: Function;
    getSolution: Function;
    coinHighlited: number | null = null;
    coinSelected: number | null = null;
    maxCoinWidth: number;
    maxCoinHeight: number;

    minCoinWeight: number = 0;
    maxCoinWeight: number = 0;
    minCoinValue: number = 0;
    maxCoinValue: number = 0;

    constructor(
        context: CanvasRenderingContext2D,
        getProblem: Function,
        getSolution: Function,
        render: Function,
        height: number,
        width: number
    ) {
        this.context = context;
        this.render = render;
        // problem object
        // each i indice in problem represents a coin, with [i][0] being its weight and [i][1] its value
        // a solution is an array of 1s and 0s, where the ith value represents inclusion or exclusion of a coin
        this.getProblem = getProblem;
        this.canvasHeight = height;
        this.canvasWidth = width;
        this.getSolution = getSolution;
        this.scale = 1;

        // assuming coins in 5x5 grid (25 coins)
        this.maxCoinWidth = width / 5;
        this.maxCoinHeight = height / 5;
    }

    draw = (): void => {
        this.render(this.drawHelper(this.getSolution(), this.getProblem()));
    };

    drawHelper = (solution: Solution, problem: Problem) => {
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        [this.minCoinWeight, this.maxCoinWeight] = this.computeRange(
            problem,
            0
        );
        [this.minCoinValue, this.maxCoinValue] = this.computeRange(problem, 1);
        return () => {
            problem.coins.forEach((c, i) => {
                // console.log("drawing coin %d %d in position %d", c[0], c[1], i);
                let highlight = false;
                if (this.coinHighlited && i === this.coinHighlited) {
                    highlight = true;
                }
                if (solution[i] == 1) {
                    this.drawCoin(c[0], c[1], i, true, highlight);
                } else {
                    this.drawCoin(c[0], c[1], i, false, highlight);
                }
            });
        };
    };

    computeRange = (problem: Problem, i: number): number[] => {
        let min = problem.coins[0][i];
        let max = min;
        problem.coins.forEach((c) => {
            min = Math.min(min, c[i]);
            max = Math.max(max, c[i]);
        });
        return [min, max];
    };

    handleMouseUp = (event: MouseEvent): number => {
        // send selected coin to controller for:
        // if selected coin is in solution, remove it
        // if selected coin is not in solution, and it is valid, add it

        // clear selected and highlighted coins
        throw new Error("Method not implemented.");
    };
    handleMouseDown = (event: MouseEvent): void => {
        // select a coin
        throw new Error("Method not implemented.");
    };
    handleMouseLeave = (event: MouseEvent): void => {
        // remove selected coin and highlighted coins
        throw new Error("Method not implemented.");
    };
    handleMouseMove = (event: MouseEvent): void => {
        // if no coin is selected, highlight coins that are moused over
        // if highlighted coin changes, show result in weight meter, and
        // highlight
        let mcpt = [event.offsetX, event.offsetY];
        let { coins } = this.getProblem();
        // let coinIndex = this.canvasToCoin(mcpt);
        let mouseCoin = null;
        let mouseCoinDsq = 0;
        for (let i = 0; i < coins.length; i++) {
            let coinCenter = this.coinToCanvas(i);
            let coinRadius = this.computeRadius(coins[i][0]);
            let dsq = distanceSqr(mcpt, coinCenter);
            if (dsq < Math.pow(Math.max(2, coinRadius), 2)) {
                if (mouseCoin == null || dsq < mouseCoinDsq) {
                    mouseCoin = i;
                    mouseCoinDsq = dsq;
                }
            }
        }

        if (this.coinHighlited !== mouseCoin) {
            this.coinHighlited = mouseCoin;
        }
        this.draw();
    };
    // drawcoin function
    drawCoin = (
        coinWeight: number,
        coinValue: number,
        i: number,
        inSolution: boolean,
        highlight: boolean
    ) => {
        let radius = this.computeRadius(coinWeight);
        let color = this.computeColor(coinValue);
        let center = this.coinToCanvas(i);
        this.context.beginPath();
        this.context.arc(center[0], center[1], radius, 0, 2 * Math.PI);
        this.context.fillStyle = color;
        this.context.fill();
        this.context.lineWidth = this.scale * 4;
        if (inSolution || highlight) {
            if (inSolution) {
                this.context.strokeStyle = "green";
            }
            if (highlight) {
                this.context.strokeStyle = "blue";
            }
            if (inSolution && highlight) {
                this.context.strokeStyle = "red";
            }
            this.context.stroke();
        }
        this.context.fillStyle = "white";
        this.context.fillText(i.toString(), center[0], center[1]);
    };

    // draw weight scale
    drawCapacityScale = () => {};

    // fn that calculates the radius of the coin (based on weight)
    computeRadius = (coinWeight: number): number => {
        let tenthDistance = (this.maxCoinWeight - this.minCoinWeight) * 0.1;
        let scaled = scale(
            coinWeight,
            this.minCoinWeight - tenthDistance * 3,
            this.maxCoinWeight + tenthDistance
        );

        return (scaled * this.maxCoinWidth) / 2;
    };

    // fn that calculates the color of the coin (based on value)
    computeColor = (coinValue: number): string => {
        let scaled = scale(coinValue, this.minCoinValue, this.maxCoinValue);
        let colormap = interpolate(["#b87333", "#C0C0C0", "#FFD700"]);
        return colormap(scaled);
    };
    // fn that calculates the posn of the coin on canvas
    coinToCanvas = (i: number): number[] => {
        let col = i % 5;
        let row = Math.floor(i / 5);
        return [
            col * this.maxCoinHeight + this.maxCoinHeight / 2,
            row * this.maxCoinWidth + this.maxCoinWidth / 2,
        ];
    };
    // fn that calculates canvas x,y coords to the coin index in problem
    canvasToCoin = (ptc: number[]): number => {
        let col = Math.floor(ptc[0] / this.maxCoinWidth);
        let row = Math.floor(ptc[1] % this.maxCoinHeight);
        return col + row * 5;
    };
}
