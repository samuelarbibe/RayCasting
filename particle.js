/// <reference path="./libraries/p5.d/p5.global-mode.d.ts" />

class Particle {

    constructor(fov, res) {
        this.pos = createVector(topViewW / 2, topViewH / 2);
        this.rays = [];
        this.FOV = fov;
        this.resolution = res;
        this.dir = createVector();
        this.angle = 0;
        this.speed = 1;

        for (let a = 0; a < this.FOV; a += this.resolution) {
            this.rays.push(new Ray(this.pos, radians(a)));
        }
    }

    move(direction) {
        let movDir = this.dir.copy();
        movDir.rotate(radians(direction));
        movDir.mult(this.speed);

        this.pos.add(movDir);
    }

    // get the mouse pos, point to it
    setDir(x, y) {
        this.dir.x = x - this.pos.x;
        this.dir.y = y - this.pos.y;
        this.dir.normalize();
        this.angle = degrees(this.dir.heading());

        for (let a = -this.FOV / 2, i = 0; a < this.FOV / 2; a += this.resolution, i++) {
            this.rays[i].setDir(radians(this.angle + a));
        }
    }

    setAngle(angle) {
        this.dir = p5.Vector.fromAngle(radians(angle));
        this.angle = angle;

        for (let a = -this.FOV / 2, i = 0; a < this.FOV / 2; a += this.resolution, i++) {
            this.rays[i].setDir(radians(this.angle + a));
        }
    }

    setPos(x, y) {
        this.pos.x = x;
        this.pos.y = y;
    }

    cast(walls) {
        let scene = [];
        for (let r = 0; r < this.rays.length; r++) {
            let closetPoint = null;
            let minDist = Infinity;
            for (let wall of walls) {
                const pt = this.rays[r].cast(wall);
                if (pt) {
                    const dist = p5.Vector.dist(this.pos, pt);
                    if (dist < minDist) {
                        closetPoint = pt;
                        minDist = dist;
                    }
                }
            }
            // if closest cast was found
            // draw it.
            if (closetPoint) {
                line(this.pos.x, this.pos.y, closetPoint.x, closetPoint.y);
            }
            scene[r] = minDist;
        }
        return scene;
    }

    draw() {
        fill(255);
        ellipse(this.pos.x, this.pos.y, 5);

        for (let ray of this.rays) {
            ray.draw();
        }
    }
}