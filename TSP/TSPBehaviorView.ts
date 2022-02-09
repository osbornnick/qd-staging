import BehaviorView from "../view/BehaviorView.js";

export default class TSPBehaviorView implements BehaviorView {
    context: CanvasRenderingContext2D;
    render: Function;
    modelGetters: {
        getNumBins: Function;
        getBinElites: Function;
        getSolutionBehavior: Function;
        getSolutionBin: Function;
    };
    canvasWidth: number;
    canvasHeight: number;
    scale: number;
    BEHAVIOR_RADIUS_CANVAS: number = 5;

    binHighlighted: null | number[] = null;
    binSelected: null | number[][] = null;

    constructor(
        context: CanvasRenderingContext2D,
        render: Function,
        modelGetters: {
            getNumBins: Function;
            getBinElites: Function;
            getSolutionBehavior: Function;
            getSolutionBin: Function;
        },
        canvasWidth: number,
        canvasHeight: number,
        scale: number
    ) {
        this.context = context;
        this.render = render;
        this.modelGetters = modelGetters;
        this.canvasHeight = canvasHeight;
        this.canvasWidth = canvasWidth;
        this.scale = scale;
    }

    draw = (
        numBins: number,
        binElites: Map<String, {}>,
        solutionBehavior: number[],
        solutionBin: number[]
    ) => {
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.context.lineWidth = 1;
        this.context.strokeStyle = "#222222";
        for (let ii = 0; ii < numBins; ++ii) {
            for (let jj = 0; jj < numBins; ++jj) {
                let pt0 = this.behaviorToCanvas([ii / numBins, jj / numBins]);
                let pt1 = this.behaviorToCanvas([
                    (ii + 1) / numBins,
                    (jj + 1) / numBins,
                ]);
                this.context.beginPath();
                this.context.rect(
                    pt0[0],
                    pt0[1],
                    pt1[0] - pt0[0],
                    pt1[1] - pt0[1]
                );
                this.context.stroke();

                if (ii === solutionBin[0] && jj === solutionBin[1]) {
                    this.context.fillStyle = "#5555aa";
                } else if (binElites.has([ii, jj].toString())) {
                    this.context.fillStyle = "#7777ee";
                } else {
                    this.context.fillStyle = "#dddddd";
                }
                this.context.fill();
            }
        }

        if (this.binSelected !== null) {
            for (let bb = 0; bb < this.binSelected.length; ++bb) {
                if (this.binSelected[bb] === null) continue;

                let ii = this.binSelected[bb][0];
                let jj = this.binSelected[bb][1];

                this.context.lineWidth = 5;
                this.context.strokeStyle = "#009900";
                let pt0 = this.behaviorToCanvas([ii / numBins, jj / numBins]);
                let pt1 = this.behaviorToCanvas([
                    (ii + 1) / numBins,
                    (jj + 1) / numBins,
                ]);
                this.context.beginPath();
                this.context.rect(
                    pt0[0],
                    pt0[1],
                    pt1[0] - pt0[0],
                    pt1[1] - pt0[1]
                );
                this.context.stroke();
            }
        }

        if (this.binHighlighted !== null) {
            let ii = this.binHighlighted[0];
            let jj = this.binHighlighted[1];

            this.context.lineWidth = 3;
            if (binElites.has(this.binHighlighted.toString())) {
                this.context.strokeStyle = "#999900";
            } else {
                this.context.strokeStyle = "#999999";
            }

            let pt0 = this.behaviorToCanvas([ii / numBins, jj / numBins]);
            let pt1 = this.behaviorToCanvas([
                (ii + 1) / numBins,
                (jj + 1) / numBins,
            ]);
            this.context.beginPath();
            this.context.rect(pt0[0], pt0[1], pt1[0] - pt0[0], pt1[1] - pt0[1]);
            this.context.stroke();

            var ptbc = this.behaviorToCanvas(solutionBehavior);
            this.context.beginPath();
            this.context.arc(
                ptbc[0],
                ptbc[1],
                this.BEHAVIOR_RADIUS_CANVAS,
                0,
                2 * Math.PI
            );
            this.context.fillStyle = "#0000dd";
            this.context.fill();
        }
    };

    drawHelper = () => {
        let { getNumBins, getBinElites, getSolutionBehavior, getSolutionBin } =
            this.modelGetters;
        // numBins, binElites, solutionBehavior, solutionBin
        this.render(
            this.draw(
                getNumBins(),
                getBinElites(),
                getSolutionBehavior(),
                getSolutionBin()
            )
        );
    };

    handleMouseUp = (event: MouseEvent) => {
        throw new Error("Method not implemented.");
    };
    handleMouseDown = (event: MouseEvent) => {
        if (this.binHighlighted !== null) {
            if (this.modelGetters.getBinElites().has(this.binHighlighted.toString())) {
                this.binSelected = [this.binHighlighted, this.binHighlighted];
            }
        } else {
            this.binSelected = null;
        }
        this.drawHelper();
    };

    handleMouseLeave = (event: MouseEvent) => {
        throw new Error("Method not implemented.");
    };
    handleMouseMove = (event: MouseEvent) => {
        throw new Error("Method not implemented.");
    };

    behaviorToCanvas = (bpt: number[]) => {
        return [
            Math.round(
                1.5 * this.BEHAVIOR_RADIUS_CANVAS +
                    bpt[0] *
                        (this.canvasWidth - 3.0 * this.BEHAVIOR_RADIUS_CANVAS)
            ),
            Math.round(
                1.5 * this.BEHAVIOR_RADIUS_CANVAS +
                    (1.0 - bpt[1]) *
                        (this.canvasHeight - 3.0 * this.BEHAVIOR_RADIUS_CANVAS)
            ),
        ];
    };
}
