/// <reference path="./libraries/p5.d/p5.global-mode.d.ts" />

const FRONT = 1;
const BACK = -1;
const LEFT = -1.5;
const RIGHT = 1.5;

const FOV = 90;
const res = 4;
const sceneW = 880;
const blockWidth = Math.ceil(sceneW / res);
const sceneH = 500;
const topViewW = 500;
const topViewH = 500;

const showWallBorder = false;

let neuralNet;

let windowSize;
let selectedMapDir = '';

let blocks = [];
let particle;
let scene;

let isUp, isDown, isLeft, isRight;
let building = false;
let drawScene = true;

var selectMap;

function setup() {
	createCanvas(sceneW + topViewW, topViewH);

	var margin = 10;

	var resetButton = createButton("Reset Map");
	resetButton.position(margin, topViewH + margin);
	resetButton.mousePressed(resetCanvas);

	var saveMapButton = createButton("Save Map");
	saveMapButton.position(80 + margin, topViewH + margin);
	saveMapButton.mousePressed(saveMap);

	selectMap = createSelect();
	selectMap.position(160 + margin, topViewH + margin);
	selectMap.option('map1');
	selectMap.option('map2');
	selectMap.option('map3');
	selectMap.option('map4');
	selectMap.changed(setSelectedMap);

	selectedMapDir = './maps/map1.json';

	var loadMapButton = createButton("Load Selected Map");
	loadMapButton.position(240 + margin, topViewH + margin);
	loadMapButton.mousePressed(readJSON);

	resetCanvas();
	readJSON();

	// input has [res] number of sensors
	// 5 hidden layers
	// 4 outputs - up, down, left, right
	const topology = [res, 5, 4];

	neuralNet = new NeuralNetwork(topology);
}

function setSelectedMap() {
	switch (selectMap.value()) {
		case 'map1':
			selectedMapDir = './maps/map1.json';
			break;
		case 'map2':
			selectedMapDir = './maps/map2.json';
			break;
		case 'map3':
			selectedMapDir = './maps/map3.json';
			break;
		case 'map4':
			selectedMapDir = './maps/map4.json';
			break;
		default:
			selectedMapDir = './maps/map1.json';
			break;
	}
}

function resetCanvas() {
	for (let block of blocks) {
		block.clear();
	}
	blocks = [];
	addPoint(0, 0);
	addPoint(topViewW, 0);
	addPoint(topViewW, topViewH);
	addPoint(0, topViewH);
	addPoint(0, 0);

	particle = new Particle(FOV, res);
	scene = new Scene(sceneW, sceneH, topViewW, 0);
}

function loadMap(data) {
	if (data) {
		resetCanvas();
		for (let item of data) {
			addPoint(item.x, item.y);
		}
	} else {
		console.log("Could not load map.");
	}
}

function readJSON() {
	loadJSON(selectedMapDir, loadMap);
}

function saveMap() {
	let data = [];

	for (let i = 1; i < blocks.length; i++) {
		for (let j = 0; j < blocks[i].points.length - 1; j++) {
			data.push({
				"x": blocks[i].points[j].x,
				"y": blocks[i].points[j].y
			});
		}
		data.push({
			"x": blocks[i].points[0].x,
			"y": blocks[i].points[0].y
		});
	}

	saveJSON(data, "map1.json");
}

function mousePressed() {
	addPoint(mouseX, mouseY);
}

function addPoint(x, y) {
	if (checkBoundaries(x, y)) {
		if (!building) {
			blocks.push(new Block());
			building = true;
		}
		building = blocks[blocks.length - 1].addPoint(x, y);
	}
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
		particle.acc(FRONT);
	}
	if (isDown) {
		particle.break(BACK);
	}
	if (isLeft) {
		particle.rotate(LEFT);
	}
	if (isRight) {
		particle.rotate(RIGHT);
	}
}

function checkBoundaries(x, y) {
	if (x < 0 || y < 0 || x > topViewW || y > topViewH) {
		return false;
	}
	return true;
}

function draw() {
	input();

	background(20);

	for (let block of blocks) {
		block.draw();
	}

	const data = particle.cast(blocks);
	particle.draw();

	if (drawScene) {
		scene.setData(data);
		scene.draw();
	}
}
