import TSPController from "./controllers/TSPController.js";

function makeCanvas(size: number) {
    let canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    return canvas;
}
let onCanvas = makeCanvas(540);
let offCanvas = makeCanvas(540);

document.getElementById("taskCanvasParent")?.appendChild(onCanvas);
document.getElementById("offscreenTaskParent")?.appendChild(offCanvas);

let TSP = new TSPController(
    onCanvas,
    offCanvas,
    window.requestAnimationFrame,
    () => console.log("new solution recorded")
);
