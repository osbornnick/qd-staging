function distanceSqr(p0: number[], p1: number[]): number {
    return (
        (p0[0] - p1[0]) * (p0[0] - p1[0]) + (p0[1] - p1[1]) * (p0[1] - p1[1])
    );
}

function distance(p0: number[], p1: number[]): number {
    return Math.sqrt(distanceSqr(p0, p1));
}

function clamp(x: number, min: number, max: number) {
    return Math.min(max, Math.max(min, x));
}

function scale(x: number, min: number, max: number) {
    return (x - min) / (max - min);
}

export { distance, distanceSqr, clamp, scale };
