/// <reference path="./libraries/p5.d/p5.global-mode.d.ts" />

class Scene {

    constructor(width, height, x, y) {
        this.data = [];
        this.size = createVector(width, height);
        this.pos = createVector(x, y);
    }

    setData(data) {
        this.data = data;
    }

    draw() {
        push();
        
        const w = this.size.x / this.data.length;
        translate(this.pos.x, this.pos.y);
        // background
        const b1 = color(0);
        const b2 = color(245);
        setGradient(0, this.size.y / 2, this.size.x, this.size.y / 2, b1, b2);
        noStroke();
        for (let i = 0; i < this.data.length; i++) {
            const color = map(this.data[i], 0, this.size.x/1.5, 255, 0);
            const h = map(this.data[i], 0, this.size.x/1.5, this.size.y, 0);
            fill(color);
            rectMode(CENTER);
            rect(i * w + w / 2, this.size.y / 2, w+0.5, h);
        }
        pop();
    }
}

function setGradient(x, y, w, h, c1, c2) {
    noFill();

    // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
        let inter = map(i, y, y + h, 0, 1);
        let c = lerpColor(c1, c2, inter);
        stroke(c);
        line(x, i, x + w, i);
    }
}