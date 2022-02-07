import Solution from "../interfaces/Solution.js";
import Problem from "../interfaces/Problem.js";
import TaskView from "./TaskView.js";
import { distanceSqr } from "../util/util.js";

export default class TSPView implements TaskView {
    context: CanvasRenderingContext2D;
    render: Function;
    canvasWidth: number;
    canvasHeight: number;
    scale: number;
    getProblem: Function;
    getSolution: Function;
    CITY_RADIUS: number = 20;
    cityHighlited: number | null = null;
    citiesSelected: number[] = [];

    constructor(
        context: CanvasRenderingContext2D,
        getProblem: Function,
        getSolution: Function,
        render: Function,
        height: number,
        width: number
    ) {
        this.getProblem = getProblem;
        this.getSolution = getSolution;
        this.context = context;
        this.canvasHeight = height;
        this.canvasWidth = width;
        this.render = render;
        this.scale = 1;
        this.drawHelper();
    }

    // call render(draw) to draw canvas updates
    draw(solution: Solution, problem: Problem): Function {
        return () => {
            this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            for (let ii = 0; ii < solution.length; ++ii) {
                let src = solution[ii];
                let dst = solution[(ii + 1) % solution.length];
                this.drawEdge(
                    [src, dst],
                    "#999999",
                    Math.max(1, 10 * this.scale)
                );
            }
            if (this.citiesSelected.length > 0) {
                for (let ii = 0; ii + 1 < this.citiesSelected.length; ++ii) {
                    let src = this.citiesSelected[ii];
                    let dst = this.citiesSelected[ii + 1];
                    this.drawEdge(
                        [src, dst],
                        "#009900",
                        Math.max(1, 3 * this.scale)
                    );
                }
            }
            for (let ii = 0; ii < problem.length; ++ii) {
                this.drawCity(ii, problem[ii]);
            }
        };
    }

    drawHelper = () => {
        this.render(this.draw(this.getSolution(), this.getProblem()));
    };

    // new solution segment! replace section of old solution with return value in controller please
    handleMouseUp: Solution | null = (event: MouseEvent) => {
        let returnMe = null;
        if (this.citiesSelected.length !== 0) {
            returnMe = this.citiesSelected.slice();
            this.citiesSelected = [];
        }
        return returnMe;
    };

    handleMouseDown = (event: MouseEvent) => {
        if (this.cityHighlited !== null) {
            this.citiesSelected = [this.cityHighlited];
        } else {
            this.citiesSelected = [];
        }
        this.drawHelper();
    };

    handleMouseLeave = (event: MouseEvent) => {
        this.cityHighlited = null;
        this.citiesSelected = [];
        this.drawHelper();
    };

    handleMouseMove = (event: MouseEvent) => {
        let mcpt = [event.offsetX, event.offsetY];
        let problem = this.getProblem();

        let mouseCity = null;
        let mouseCityDsq = 0;
        // find which city its closest too
        for (let ii = 0; ii < problem.length; ++ii) {
            let cpt = this.problemToCanvas(problem[ii]);
            let dsq = distanceSqr(mcpt, cpt);
            if (dsq < Math.pow(Math.max(2, this.CITY_RADIUS * this.scale), 2)) {
                if (mouseCity == null || dsq < mouseCityDsq) {
                    mouseCity = ii;
                    mouseCityDsq = dsq;
                }
            }
        }

        if (this.cityHighlited !== mouseCity) {
            this.cityHighlited = mouseCity;
            if (this.cityHighlited !== null && this.citiesSelected.length > 0) {
                let index = this.citiesSelected.indexOf(this.cityHighlited);
                if (index === -1) {
                    this.citiesSelected.push(this.cityHighlited);
                } else {
                    this.citiesSelected = this.citiesSelected.slice(
                        0,
                        index + 1
                    );
                }
            }
        }
        this.drawHelper();
    };

    problemToCanvas = (ppt: number[]) => {
        // what is going on here
        return [
            1.5 * this.CITY_RADIUS +
                ppt[0] * (this.canvasWidth - 3 * this.CITY_RADIUS),
            1.5 * this.CITY_RADIUS +
                (1.0 - ppt[1]) * (this.canvasHeight - 3.0 * this.CITY_RADIUS),
        ];
    };

    drawEdge = (edge: number[], color: string, width: number) => {
        let problem = this.getProblem();
        let cc0 = this.problemToCanvas(problem[edge[0]]);
        let cc1 = this.problemToCanvas(problem[edge[1]]);
        this.context.beginPath();
        this.context.moveTo(cc0[0], cc0[1]);
        this.context.lineTo(cc1[0], cc1[1]);
        this.context.strokeStyle = color;
        this.context.lineWidth = width;
        this.context.stroke();
    };

    drawCity = (index: number, ppt: number[]) => {
        let cpt = this.problemToCanvas(ppt);
        this.context.beginPath();
        this.context.arc(
            cpt[0],
            cpt[1],
            Math.max(2, this.CITY_RADIUS * this.scale),
            0,
            2 * Math.PI
        );
        this.context.fillStyle = "#dddddd";
        this.context.fill();
        if (this.citiesSelected.indexOf(index) !== -1) {
            this.context.strokeStyle = "#009900";
            this.context.lineWidth = Math.max(1, 5 * this.scale);
            this.context.stroke();
        }
        if (index === this.cityHighlited) {
            this.context.strokeStyle = "#999900";
            this.context.lineWidth = Math.max(1, 3 * this.scale);
            this.context.stroke();
        }
    };
}
