/// <reference path="./libraries/p5.d/p5.global-mode.d.ts" />

class Boundary {
    constructor(x1, y1, x2, y2) {
        this.a = createVector(x1, y1);
        this.b = createVector(x2, y2);
    }

    draw() {
        stroke(255);
        line(this.a.x, this.a.y, this.b.x, this.b.y);
    }
}