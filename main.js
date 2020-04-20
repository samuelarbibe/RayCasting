/// <reference path="./libraries/p5.d/p5.global-mode.d.ts" />

const FRONT = 1;
const BACK = -1;
const LEFT = -1.5;
const RIGHT = 1.5;

const FOV = 60;
const res = 30;
const sceneW = 880;
const blockWidth = Math.ceil(sceneW / res);
const sceneH = 500;
const topViewW = 500;
const topViewH = 500;

var windowSize;

let blocks = [];
let particle;
let scene;

let isUp, isDown, isLeft, isRight;
let building = false;

function setup() {
	createCanvas(sceneW + topViewW, topViewH);

	// scene walls
	blocks.push(new Block());
	blocks[0].addPoint(0,0);
	blocks[0].addPoint(topViewW, 0);
	blocks[0].addPoint(topViewW,topViewH);
	blocks[0].addPoint(0,topViewH);
	blocks[0].addPoint(0,0);

	particle = new Particle(FOV, res);
	scene = new Scene(sceneW, sceneH, topViewW, 0);
}

function mousePressed(){
	if(!building)
	{
		blocks.push(new Block());
		building = true;
	}
	building = blocks[blocks.length-1].addPoint(mouseX, mouseY);
}

function keyPressed() {
	setPressedKey(keyCode, true);
}

function keyReleased() {
	setPressedKey(keyCode, false);
}

function setPressedKey(key, isPressed) {
	switch (key) {
		case UP_ARROW:
			return isUp = isPressed;

		case DOWN_ARROW:
			return isDown = isPressed;

		case LEFT_ARROW:
			return isLeft = isPressed;

		case RIGHT_ARROW:
			return isRight = isPressed;

		default:
			return isPressed;
	}
}

function input() {
	if (isUp) {
		particle.move(FRONT);
	}
	if (isDown) {
		particle.move(BACK);
	}
	if (isLeft) {
		particle.rotate(LEFT);
	}
	if (isRight) {
		particle.rotate(RIGHT);
	}
}


function draw() {
	input();

	background(20);

	for (let block of blocks) {
		block.draw();
	}

	scene.setData(particle.cast(blocks));
	particle.draw();

	scene.draw();
}