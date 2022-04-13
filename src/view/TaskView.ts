export default interface TaskView {
    context: CanvasRenderingContext2D;
    render: Function;
    canvasWidth: number;
    canvasHeight: number;
    scale: number;
    getProblem: Function;
    getSolution: Function;
    indexColors: Function | null;

    draw(): void;

    handleMouseUp(event: MouseEvent): any;
    handleMouseDown(event: MouseEvent): void;
    handleMouseLeave(event: MouseEvent): void;
    handleMouseMove(event: MouseEvent): void;
}
