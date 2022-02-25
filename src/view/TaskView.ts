import Problem from "../interfaces/Problem";
import Solution from "../interfaces/Solution";

export default interface TaskView {
    context: CanvasRenderingContext2D;
    render: Function;
    canvasWidth: number;
    canvasHeight: number;
    scale: number;
    getProblem: Problem;
    getSolution: Solution;

    draw(): void;

    handleMouseUp(event: MouseEvent): any;
    handleMouseDown(event: MouseEvent): void;
    handleMouseLeave(event: MouseEvent): void;
    handleMouseMove(event: MouseEvent): void;
}
