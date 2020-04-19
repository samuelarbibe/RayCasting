/// <reference path="./libraries/p5.d/p5.global-mode.d.ts" />

var windowSize;

let walls = [];
let particle;

const LEFT = -90;
const UP = 0;
const RIGHT = 90;
const DOWN = 180;


const FOV = 45;
const blockWidth = 20;
const res = 1;
const sceneW = FOV * blockWidth * res;
const sceneH = 1000;
const topViewW = 1000;
const topViewH = 1000;

function setup() {
	createCanvas(sceneW + topViewW, topViewH);

	for (let i = 0; i < 4; i++) {
		walls.push(new Boundary(random(0, topViewW), random(0, topViewH), random(0, topViewW), random(0, topViewH)));
	}

	// scene walls
	walls.push(new Boundary(0, 0, topViewW, 0));
	walls.push(new Boundary(0, 0, 0, topViewH));
	walls.push(new Boundary(0, topViewH, topViewW, topViewH));
	walls.push(new Boundary(topViewW, 0, topViewW, topViewH));

	particle = new Particle(FOV, res);

}

function input() {
	if (keyIsPressed === true) {

		if (key == 'a') {
			particle.move(LEFT);
		}
		if (key == 'w') {
			particle.move(UP);
		}
		if (key == 'd') {
			particle.move(RIGHT);
		}
		if (key == 's') {
			particle.move(DOWN);
		}

	}
}


function draw() {
	input();

	background(20);

	//particle.setDir(mouseX, mouseY);
	particle.setAngle((mouseX - topViewW) / sceneW * 360);

	for (let wall of walls) {
		wall.draw();
	}
	const scene = particle.cast(walls);
	particle.draw();


	push();
	const w = sceneW / scene.length;
	translate(topViewW, 0);
	for (let i = 0; i < scene.length; i++) {
		noStroke();
		const color = map(scene[i], 0, topViewW, 255, 0);
		const h = map(scene[i], 0, topViewW, sceneH, 0);
		fill(color);
		rectMode(CENTER);
		rect(i * w + w / 2, sceneH / 2, w, h);

	}
	pop();

}