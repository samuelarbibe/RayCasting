/// <reference path="./libraries/p5.d/p5.global-mode.d.ts" />

const FRONT = 1;
const BACK = -1;
const LEFT = -1.5;
const RIGHT = 1.5;

const FOV = 60;
const res = 120;
const sceneW = 880;
const blockWidth = Math.ceil(sceneW / res);
const sceneH = 500;
const topViewW = 500;
const topViewH = 500;

const showWallBorder = false;

let windowSize;
let selectedMapDir;

let blocks = [];
let particle;
let scene;

let isUp, isDown, isLeft, isRight;
let building = false;

function setup() {
	createCanvas(sceneW + topViewW, topViewH);

	var margin = 10;

	var resetButton = createButton("Reset Map");
	resetButton.position(margin, topViewH + margin);
	resetButton.mousePressed(resetCanvas);

	var saveMapButton = createButton("Save Map");
	saveMapButton.position(80 + margin, topViewH + margin);
	saveMapButton.mousePressed(saveMap);

	var selectMap = createSelect();
	selectMap.position(160 + margin, topViewH + margin);
	selectMap.option('map1');
	selectMap.option('map2');
	selectMap.option('map3');
	selectMap.option('map4');
	selectMap.changed(setSelectedMap);

	var loadMapButton = createButton("Load Selected Map");
	loadMapButton.position(240 + margin, topViewH + margin);
	loadMapButton.mousePressed(loadMap);

	resetCanvas();
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
	blocks.push(new Block());
	blocks[0].addPoint(0, 0);
	blocks[0].addPoint(topViewW, 0);
	blocks[0].addPoint(topViewW, topViewH);
	blocks[0].addPoint(0, topViewH);
	blocks[0].addPoint(0, 0);

	particle = new Particle(FOV, res);
	scene = new Scene(sceneW, sceneH, topViewW, 0);
}

function loadMap() {
	resetCanvas();
	let data = loadJSON(selectedMapDir);

	console.log(data[0]["x"]);

	for (let i = 0; i < data.length; i++) {
		addPoint(data[i][0], data[i][1]);
	}
}

function saveMap() {
	let data = [];

	for (let i = 0; i < blocks.length; i++) {
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

	saveJSON(data, "map999.json");
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
		building = blocks[blocks.length - 1].addPoint(mouseX, mouseY);
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

function checkBoundaries(x, y) {
	if (x < 0 || y < 0 || x > topViewW || y > topViewH) {
		return false;
	}
	return true;
}