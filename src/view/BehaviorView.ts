export default interface BehaviorView {
    context: CanvasRenderingContext2D;
    render: Function;
    canvasWidth: number;
    canvasHeight: number;
    scale: number;
    solutionsVisible: boolean;
    visibleSolutionBehaviors: any;

    draw(): void;
    handleMouseUp(event: MouseEvent): any;
    handleMouseDown(event: MouseEvent): void;
    handleMouseLeave(event: MouseEvent): void;
    handleMouseMove(event: MouseEvent): void;
    showSolutions(): void;
    setVisibleBehaviors(b: any): void;
}
