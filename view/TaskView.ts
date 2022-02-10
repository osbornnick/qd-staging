import Problem from "../interfaces/Problem.js";
import Solution from "../interfaces/Solution.js";

export default interface TaskView {
    context: CanvasRenderingContext2D | null;
    render: Function;
    canvasWidth: number;
    canvasHeight: number;
    scale: number;
    getProblem: Problem;
    getSolution: Solution;

    draw(): void;

    handleMouseUp(event: MouseEvent): void;
    handleMouseDown(event: MouseEvent): void;
    handleMouseLeave(event: MouseEvent): void;
    handleMouseMove(event: MouseEvent): void;
}
