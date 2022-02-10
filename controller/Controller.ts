export default abstract class Controller {
    offScreenCanvas: HTMLCanvasElement;
    onScreenCanvas: HTMLCanvasElement;
    getSolution: Function;

    constructor(
        offScreenCanvas: HTMLCanvasElement,
        onScreenCanvas: HTMLCanvasElement,
        getSolution: Function
    ) {
        this.offScreenCanvas = offScreenCanvas;
        this.onScreenCanvas = onScreenCanvas;
        this.getSolution = getSolution;
    }

    // wrap window.requestAnimationFrame
    render: Function = (requestAnimationFrame: Function) => {
        // return a fn that takes a fn as an argument, to addon some functionality to that function
        return (drawFn: Function) => {
            let drawAddon = () => {
                // call the given draw function, which draws to offscreen canvas
                // then copy that to the on screen canvas
                drawFn();
                let context = this.onScreenCanvas.getContext("2d");
                context?.clearRect(
                    0,
                    0,
                    this.onScreenCanvas.width,
                    this.onScreenCanvas.height
                );
                context?.drawImage(this.offScreenCanvas, 0, 0);
            };
            requestAnimationFrame(drawAddon);
        };
    };
}
