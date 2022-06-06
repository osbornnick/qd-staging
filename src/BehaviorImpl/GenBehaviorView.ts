import Solution from "../interfaces/Solution";
import BehaviorView from "../view/BehaviorView";
import interpolate from "color-interpolate";
import { distance } from "../util/util";

export default class GenBehaviorView implements BehaviorView {
    context: CanvasRenderingContext2D;
    render: Function;
    modelGetters: {
        getNumBins: Function;
        getBinElites: Function;
        getSolutionBehavior: Function;
        getSolutionBin: Function;
        getScoreRange: Function;
        getCurrentScore: Function;
    };
    canvasWidth: number;
    canvasHeight: number;
    scale: number;
    BEHAVIOR_RADIUS_CANVAS: number = 5;
    solutionsVisible: boolean = false;
    visibleSolutionBehaviors = [];
    visibleSolutionPoints: number[][] = [];

    binHighlighted: null | number[] = null;
    binSelected: null | number[][] = null;
    solutionHighlighted: null | number = null;
    solutionSelected: null | number = null;

    constructor(
        context: CanvasRenderingContext2D,
        render: Function,
        modelGetters: {
            getNumBins: Function;
            getBinElites: Function;
            getSolutionBehavior: Function;
            getSolutionBin: Function;
            getScoreRange: Function;
            getCurrentScore: Function;
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
        let {
            getNumBins,
            getBinElites,
            getSolutionBehavior,
            getSolutionBin,
            getScoreRange,
            getCurrentScore,
        } = this.modelGetters;
        // numBins, binElites, solutionBehavior, solutionBin
        this.render(
            this.drawHelper(
                getNumBins(),
                getBinElites(),
                getSolutionBehavior(),
                getSolutionBin(),
                getScoreRange(),
                getCurrentScore()
            )
        );
    };

    drawHelper = (
        numBins: number,
        binElites: Map<String, { solution: Solution; score: number }>,
        solutionBehavior: number[],
        solutionBin: number[],
        scoreRange: number[],
        currentScore: number
    ) => {
        return () => {
            this.drawBins(numBins, binElites, solutionBin, scoreRange);
            this.drawSelectedBins(numBins);
            this.drawHighlightedBin(numBins, binElites);

            this.drawVisibleBehaviors();
            this.drawCurrentBehavior(
                solutionBehavior,
                scoreRange,
                currentScore
            );
        };
    };

    drawHighlightedBin = (numBins: number, binElites: Map<String, {}>) => {
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
        }
    };

    drawCurrentBehavior = (
        solutionBehavior: number[],
        scoreRange: number[],
        currentScore: number
    ) => {
        this.context.fillStyle = this.computeColor(scoreRange, currentScore);
        this.context.strokeStyle = "white";
        this.drawBehaviorPoint(solutionBehavior);
    };

    drawBehaviorPoint = (solutionBehavior: number[]) => {
        let ptbc = this.behaviorToCanvas(solutionBehavior);
        this.context.beginPath();
        this.context.arc(
            ptbc[0],
            ptbc[1],
            this.BEHAVIOR_RADIUS_CANVAS,
            0,
            2 * Math.PI
        );
        this.context.lineWidth = 2;
        this.context.fill();
        this.context.stroke();
    };

    drawHighlightedBehaviorPoint(solutionBehavior: number[]) {
        this.context.fillStyle = "blue";
        this.context.strokeStyle = "#999900";
        this.drawBehaviorPoint(solutionBehavior);
    }
    drawSelectedBehaviorPoint(solutionBehavior: number[]) {
        this.context.fillStyle = "blue";
        this.context.strokeStyle = "white";
        this.drawBehaviorPoint(solutionBehavior);
    }

    drawVisibleBehaviors = () => {
        if (this.solutionsVisible) {
            this.context.fillStyle = "blue";
            this.context.strokeStyle = "blue";
            this.visibleSolutionBehaviors.forEach((b, i) => {
                if (
                    this.solutionHighlighted === i ||
                    this.solutionSelected === i
                ) {
                    if (this.solutionHighlighted === i)
                        this.drawHighlightedBehaviorPoint(b);
                    if (this.solutionSelected === i)
                        this.drawSelectedBehaviorPoint(b);
                } else {
                    this.context.fillStyle = "blue";
                    this.context.strokeStyle = "blue";
                    this.drawBehaviorPoint(b);
                }
            });
        }
    };

    drawBins = (
        numBins: number,
        binElites: Map<String, { solution: Solution; score: number }>,
        solutionBin: number[],
        scoreRange: number[]
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

                // if (ii === solutionBin[0] && jj === solutionBin[1]) {
                //     this.context.fillStyle = "#5555aa";
                // }
                if (binElites.has([ii, jj].toString())) {
                    let elite = binElites.get([ii, jj].toString());
                    let fillColor = "#7777ee";
                    if (elite != undefined) {
                        fillColor = this.computeColor(scoreRange, elite.score);
                    }
                    this.context.fillStyle = fillColor;
                } else {
                    this.context.fillStyle = "#dddddd";
                }
                this.context.fill();
            }
        }
    };

    drawSelectedBins = (numBins: number) => {
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
    };

    handleMouseUp = (event: MouseEvent) => {
        let returnMe = null;
        if (this.solutionSelected !== null) {
            returnMe = {
                solution: true,
                crossover: false,
                solutionSelected: this.solutionSelected,
            };
            this.solutionSelected = null;
        }
        if (this.binSelected !== null) {
            if (this.binSelected[0] !== null && this.binSelected[1] !== null) {
                if (
                    this.binSelected[0].toString() ===
                    this.binSelected[1].toString()
                ) {
                    returnMe = {
                        solution: false,
                        crossover: false,
                        binKey: this.binSelected[0].slice(),
                    }; // for controller to pass new solution (it gets from model)
                } else {
                    returnMe = {
                        solution: false,
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
        if (this.solutionHighlighted !== null) {
            this.solutionSelected = this.solutionHighlighted;
        } else if (this.binHighlighted !== null) {
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
        this.solutionHighlighted = null;
        this.solutionSelected = null;
        this.draw();
    };

    handleMouseMove = (event: MouseEvent) => {
        let mcpt = [event.offsetX, event.offsetY];
        let mouseBin = null;
        this.solutionHighlighted = null;

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

        this.visibleSolutionPoints.forEach((point, i) => {
            if (distance(point, mcpt) < this.BEHAVIOR_RADIUS_CANVAS)
                this.solutionHighlighted = i;
        });

        if (this.solutionHighlighted !== null) {
            this.binSelected = null;
            this.binHighlighted = null;
            this.draw();
            return;
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

    computeColor = (scoreRange: number[], score: number): string => {
        // assume worstScore < bestScore
        // if not, switch em
        let worstScore = scoreRange[0];
        let bestScore = scoreRange[1];
        let goodColor = "#333dff";
        let badColor = "#fb4b4b";
        let cols = [badColor, goodColor];
        let min = worstScore;
        let max = bestScore;
        let colormap;
        if (worstScore > bestScore) {
            min = bestScore;
            max = worstScore;
            cols = [goodColor, badColor];
        }
        let scaled;
        if (max === min) scaled = 1;
        else scaled = (score - min) / (max - min);

        colormap = interpolate(cols);
        return colormap(scaled);
    };

    showSolutions() {
        this.solutionsVisible = true;
    }

    setVisibleBehaviors(b: any) {
        this.visibleSolutionBehaviors = b;
        this.visibleSolutionPoints = [];
        for (let solutionBehavior of b) {
            let ptbc = this.behaviorToCanvas(solutionBehavior);
            this.visibleSolutionPoints.push(ptbc);
        }
    }
}
