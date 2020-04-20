/// <reference path="./libraries/p5.d/p5.global-mode.d.ts" />

class Particle {

    constructor(fov, res) {
        this.pos = createVector(topViewW / 2 + 1, topViewH / 2);
        this.rays = [];
        this.FOV = fov;
        this.resolution = res;
        this.rayDirDelta = this.FOV / this.resolution;
        this.dir = createVector();
        this.angle = 0;
        this.speed = 1.5;
        this.minDist = Infinity;

        for (let a = 0; a < this.FOV; a += this.rayDirDelta) {
            this.rays.push(new Ray(this.pos, radians(a)));
        }
    }

    move(direction) {
        let movDir = this.dir.copy();
        movDir.mult(this.speed * direction);

        const nextPos = p5.Vector.add(movDir, this.pos);
        // check if out boundaries
        if (!checkBoundaries(nextPos.x, nextPos.y) || (direction > 0 && this.minDist < 5)) {
            return;
        }
        this.pos.add(movDir);
    }

    rotate(amount) {
        this.setAngle(this.angle + amount);
    }

    // get the mouse pos, point to it
    setDir(x, y) {
        this.dir.x = x - this.pos.x;
        this.dir.y = y - this.pos.y;
        this.dir.normalize();
        this.angle = degrees(this.dir.heading());

        for (let a = -this.FOV / 2, i = 0; a < this.FOV / 2; a += this.rayDirDelta, i++) {
            this.rays[i].setDir(radians(this.angle + a));
        }
    }

    setAngle(angle) {
        this.dir = p5.Vector.fromAngle(radians(angle));
        this.angle = angle;

        for (let a = -this.FOV / 2, i = 0; a < this.FOV / 2; a += this.rayDirDelta, i++) {
            this.rays[i].setDir(radians(this.angle + a));
        }
    }

    setPos(x, y) {
        this.pos.x = x;
        this.pos.y = y;
    }

    cast(blocks) {
        let scene = [];
        this.minDist = Infinity;
        for (let r = 0; r < this.rays.length; r++) {
            let closetPoint = null;
            let minDist = Infinity;
            for (let block of blocks) {
                for (let wall of block.walls) {
                    const pt = this.rays[r].cast(wall);
                    if (pt) {
                        const dist = p5.Vector.dist(this.pos, pt);
                        if (dist < minDist) {
                            closetPoint = pt;
                            minDist = dist;
                        }
                    }
                }
            }
            // if closest cast was found
            // draw it.
            if (closetPoint) {
                line(this.pos.x, this.pos.y, closetPoint.x, closetPoint.y);
            }
            scene[r] = minDist;
            if (minDist < this.minDist) {
                this.minDist = minDist;
            }
        }

        if (showWallBorder) {
            for (let r = 1; r < scene.length - 1; r++) {
                if (scene[r + 1] - scene[r] > 50 || scene[r - 1] - scene[r] > 50) {
                    scene[r] *= -1;
                }
            }
        }

        return scene;
    }

    draw() {
        fill(255);
        ellipse(this.pos.x, this.pos.y, 5);
    }
}