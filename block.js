/// <reference path="./libraries/p5.d/p5.global-mode.d.ts" />

class Block {
    constructor() {
        this.points = [];
        this.walls = [];
        this.pointRadius = 20;
        this.closed = false;
    }

    addPoint(x, y) {
        if (this.points.length == 0) {
            this.points.push(createVector(x, y));
        } // check if shape is closed
        else if (this.checkShapeClosed(x, y)) {
            const x1 = this.points[this.points.length - 1].x;
            const y1 = this.points[this.points.length - 1].y;
            const x2 = this.points[0].x;
            const y2 = this.points[0].y;
            this.walls.push(new Boundary(x1, y1, x2, y2));
            return false;
        }
        else {
            this.points.push(createVector(x, y));
            const x1 = this.points[this.points.length - 2].x;
            const y1 = this.points[this.points.length - 2].y;
            const x2 = this.points[this.points.length - 1].x;
            const y2 = this.points[this.points.length - 1].y;
            this.walls.push(new Boundary(x1, y1, x2, y2));
        }
        return true;
    }

    // function gets a position, checks if it
    // is near an existing point.
    // when a point is added unto the first point,
    // this closes the shape
    checkShapeClosed(x, y) {
        if (this.points.length > 1) {
            const firstPoint = this.points[0].copy();
            if (abs(firstPoint.x - x) < this.pointRadius &&
                abs(firstPoint.y - y) < this.pointRadius) {
                this.closed = true;
                return true;
            }
        }
        return false;
    }

    draw()
    {
        for(let wall of this.walls)
        {
            wall.draw();
        }

        if(!this.closed)
        {
            for(let point of this.points)
            {
                ellipse(point.x, point.y, this.pointRadius);
            }
        }
    }
}