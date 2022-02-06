import Problem from "../interfaces/Problem";
import Solution from "../interfaces/Solution";

export default interface TaskView {
    context: CanvasRenderingContext2D;
    render: Function;
    canvasWidth: Number;
    canvasHeight: Number;
    scale: Number;

    draw(solution: Solution, problem: Problem): void;

    handleMouseUp(event: Event): void;
    handleMouseDown(event: Event): void;
    handleMouseLeave(event: Event): void;
    handleMouseMove(event: Event): void;
}
