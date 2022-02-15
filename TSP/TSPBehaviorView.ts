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

    draw = () => {
        let { getNumBins, getBinElites, getSolutionBehavior, getSolutionBin } =
            this.modelGetters;
        // numBins, binElites, solutionBehavior, solutionBin
        this.render(
            this.drawHelper(
                getNumBins(),
                getBinElites(),
                getSolutionBehavior(),
                getSolutionBin()
            )
        );
    };

    drawHelper = (
        numBins: number,
        binElites: Map<String, {}>,
        solutionBehavior: number[],
        solutionBin: number[]
    ) => {
        return () => {
            this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            this.context.lineWidth = 1;
            this.context.strokeStyle = "#222222";
            for (let ii = 0; ii < numBins; ++ii) {
                for (let jj = 0; jj < numBins; ++jj) {
                    let pt0 = this.behaviorToCanvas([
                        ii / numBins,
                        jj / numBins,
                    ]);
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
                    let pt0 = this.behaviorToCanvas([
                        ii / numBins,
                        jj / numBins,
                    ]);
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
                this.context.rect(
                    pt0[0],
                    pt0[1],
                    pt1[0] - pt0[0],
                    pt1[1] - pt0[1]
                );
                this.context.stroke();
            }
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
        };
    };

    handleMouseUp = (event: MouseEvent) => {
        let returnMe = null;
        if (this.binSelected !== null) {
            if (this.binSelected[0] !== null && this.binSelected[1] !== null) {
                if (
                    this.binSelected[0].toString() ===
                    this.binSelected[1].toString()
                ) {
                    returnMe = {
                        crossover: false,
                        binKey: this.binSelected[0].slice(),
                    }; // for controller to pass new solution (it gets from model)
                } else {
                    returnMe = {
                        crossover: true,
                        binKey1: this.binSelected[0].slice(),
                        binKey2: this.binSelected[1].slice(),
                    };
                }
                this.binSelected = null;
            } else {
                this.binSelected = null;
                this.draw();
            }
        }
        return returnMe;
    };

    handleMouseDown = (event: MouseEvent) => {
        if (this.binHighlighted !== null) {
            if (
                this.modelGetters
                    .getBinElites()
                    .has(this.binHighlighted.toString())
            ) {
                this.binSelected = [this.binHighlighted, this.binHighlighted];
            }
        } else {
            this.binSelected = null;
        }
        this.draw();
    };

    handleMouseLeave = (event: MouseEvent) => {
        this.binSelected = null;
        this.binHighlighted = null;
        this.draw();
    };

    handleMouseMove = (event: MouseEvent) => {
        let mcpt = [event.offsetX, event.offsetY];
        let mouseBin = null;

        let numBins = this.modelGetters.getNumBins();
        for (var ii = 0; ii < numBins; ++ii) {
            for (var jj = 0; jj < numBins; ++jj) {
                var pt0 = this.behaviorToCanvas([ii / numBins, jj / numBins]);
                var pt1 = this.behaviorToCanvas([
                    (ii + 1) / numBins,
                    (jj + 1) / numBins,
                ]);

                if (
                    pt0[0] <= mcpt[0] &&
                    mcpt[0] <= pt1[0] &&
                    pt1[1] <= mcpt[1] &&
                    mcpt[1] <= pt0[1]
                ) {
                    mouseBin = [ii, jj];
                }
            }
        }
        if (this.binHighlighted !== mouseBin) {
            this.binHighlighted = mouseBin;
            if (this.binHighlighted !== null && this.binSelected !== null) {
                if (
                    this.modelGetters
                        .getBinElites()
                        .has(this.binHighlighted.toString())
                ) {
                    this.binSelected[1] = this.binHighlighted;
                } else {
                    // why is this here
                    // this.binSelected[1] = null;
                }
            }
            this.draw();
        }
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