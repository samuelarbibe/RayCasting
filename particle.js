/// <reference path="./libraries/p5.d/p5.global-mode.d.ts" />

function mutate(x) {
    if (random(1) < 0.1) {
        let offset = randomGaussian() * 0.5;
        let newx = x + offset;
        return newx;
    } else {
        return x;
    }
}

class Particle {
    constructor(brain) {
        this.pos = createVector(topViewW / 2 + 1, topViewH / 2);
        this.rays = [];
        this.FOV = FOV;
        this.resolution = res;
        this.rayDirDelta = this.FOV / (this.resolution - 1);
        this.dir = createVector();
        this.angle = 0;
        this.speed = 3;
        this.minDist = Infinity;
        this.score = 0; // the 'score'
        this.fitness = 0; // the normalized 'score'
        this.alive = true;
        this.scene = [];

        for (let a = 0; a <= this.FOV; a += this.rayDirDelta) {
            this.rays.push(new Ray(this.pos, radians(a)));
        }

        if (brain instanceof NeuralNetwork) {
            this.brain = brain.copy();
            this.brain.mutate(0.2);
        } else {
            this.brain = new NeuralNetwork([this.rays.length, this.rays.length + 2, 2]);
        }
    }

    copy() {
        return new Particle(this.brain);
    }

    applyOutput(output) {
        // turn right
        if (output > 0.5) {
            this.rotate(7);
        } // turn left
        else {
            this.rotate(-7);
        }
    }

    update() {
        if (this.speed != 0 && this.alive) {
            let movDir = this.dir.copy();
            movDir.mult(this.speed);

            this.score += movDir.mag();

            const nextPos = p5.Vector.add(movDir, this.pos);
            // check if out boundaries, if out then die.
            if (!checkBoundaries(nextPos.x, nextPos.y) || (this.speed > 0 && this.minDist < 5)) {
                this.alive = false;
                this.speed = 0;
                return;
            }
            this.pos.add(movDir);
        }
    }

    think(blocks) {
        // calculate inputs
        this.cast(blocks);
        // send inputs, get action
        var action = this.brain.feedforward(this.scene);
        // decide to turn right or left
        if (action[0] > action[1]) {
            this.rotate(-5);
        } else {
            this.rotate(5);
        }

    }

    rotate(amount) {
        this.setAngle(this.angle + amount);
    }

    // get the mouse pos, point to it
    lookAt(x, y) {
        this.dir.x = x - this.pos.x;
        this.dir.y = y - this.pos.y;
        this.dir.normalize();
        this.angle = degrees(this.dir.heading());

        this.setAngle(this.angle);
    }

    setAngle(angle) {
        this.dir = p5.Vector.fromAngle(radians(angle));
        this.angle = angle;

        for (let a = -this.FOV / 2, i = 0; a <= this.FOV / 2; a += this.rayDirDelta, i++) {
            this.rays[i].setDir(radians(this.angle + a));
        }
    }

    setPos(x, y) {
        this.pos.x = x;
        this.pos.y = y;
    }

    cast(blocks) {
        this.scene = [];
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
            this.scene[r] = minDist;
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
    }

    draw() {
        fill(255);
        ellipse(this.pos.x, this.pos.y, 5);
    }
}