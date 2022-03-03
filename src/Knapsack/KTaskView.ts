import { Problem, Solution } from "./KTaskModel";
import TaskView from "../view/TaskView";

export class KTaskView implements TaskView {
    context: CanvasRenderingContext2D;
    render: Function;
    canvasWidth: number;
    canvasHeight: number;
    scale: number;
    getProblem: any;
    getSolution: any;
    coinHighlited: number | null = null;
    coinSelected: number | null = null;
    maxCoinWidth: number;
    maxCoinHeight: number;

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

        // assuming coins in 5x5 grid
        this.maxCoinWidth = width / 5;
        this.maxCoinHeight = height / 5;
    }

    draw = (): void => {
        this.render(this.drawHelper(this.getSolution(), this.getProblem()));
    };

    drawHelper = (solution: Solution, problem: Problem) => {
        return () => {
            // render everything
        };
    };

    handleMouseUp(event: MouseEvent): number {
        // send selected coin to controller for:
        // if selected coin is in solution, remove it
        // if selected coin is not in solution, and it is valid, add it

        // clear selected and highlighted coins
        throw new Error("Method not implemented.");
    }
    handleMouseDown(event: MouseEvent): void {
        // select a coin
        throw new Error("Method not implemented.");
    }
    handleMouseLeave(event: MouseEvent): void {
        // remove selected coin and highlighted coins
        throw new Error("Method not implemented.");
    }
    handleMouseMove(event: MouseEvent): void {
        // if no coin is selected, highlight coins that are moused over
        // if highlighted coin changes, show result in weight meter, and
        // highlight
        throw new Error("Method not implemented.");
    }
    // drawcoin function
    drawCoin = (i: number) => {};

    // draw weight scale
    drawCapacityScale = () => {};

    // fn that calculates the radius of the coin (based on weight)
    computeRadius = (coinWeight: number): number => {
        return 0;
    };

    // fn that calculates the color of the coin (based on value)
    computeColor = (coinValue: number): string => {
        return "";
    };
    // fn that calculates the posn of the coin on canvas
    coinToCanvas = (i: number): number[] => {
        return [0, 0];
    };
    // fn that calculates canvas x,y coords to the coin index in problem
    canvasToCoin = (ptc: number[]): number => {
        return 0;
    };
}
