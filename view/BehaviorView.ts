export default interface BehaviorView {
    context: CanvasRenderingContext2D;
    render: Function;
    canvasWidth: number;
    canvasHeight: number;
    scale: number;

    draw(...varArgs: any): void;
    handleMouseUp(event: MouseEvent): void;
    handleMouseDown(event: MouseEvent): void;
    handleMouseLeave(event: MouseEvent): void;
    handleMouseMove(event: MouseEvent): void;
}
