export default interface Task {
    // could technically implement Problem and Solution interfaces
    // not yet though
    currentSolution: Number[][];
    bestSolution: Number[][];
    previousSolution: Number[][];
    problem: Number[][];
    problemScale: Number;
    currentScore: Number;
    bestScore: Number;

    context: CanvasRenderingContext2D;
    onNewSolution: Function;
    render: Function;
    taskCanvasWidth: Number;
    taskCanvasHeight: Number;

    getName(): string;
    getObjectiveName(): string;
    getInstructions(): string;
    isMinimize(): boolean;
    setSolution(solution: Number[][], type: string): void;
    setRandomSolution(): void;
    setMutateSolution(): void;
    setCrossoverSolution(sol1: Number[][], sol2: Number[][]): void;
    setProblem(problem: Number[][]): void;
    setRandomProblem(): void;
    drawScene(): void;
}
