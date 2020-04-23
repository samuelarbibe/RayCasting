/// <reference path="./libraries/p5.d/p5.global-mode.d.ts" />

//https://shiffman.github.io/Neural-Network-p5/examples/neuro-evolution/flappy/

const FOV = 180;
const res = 5;
const sceneW = 880;
const blockWidth = Math.ceil(sceneW / res);
const sceneH = 500;
const topViewW = 500;
const topViewH = 500;
const showWallBorder = false;
let neuralNet;
let windowSize;
let selectedMapDir = '';
let particle;
let scene;
let isUp, isDown, isLeft, isRight;
let building = false;
let drawScene = true;
let myFont = null;
var selectMap;
const cyclePerFrame = 1;

let totalPop = 20;
let activeParticles = [];
let allParticles = [];
let blocks = [];
let genCount = 0;

let highScore = 0;
let bestParticle = null;

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

	setSelectedMap();

	var loadMapButton = createButton("Load Selected Map");
	loadMapButton.position(240 + margin, topViewH + margin);
	loadMapButton.mousePressed(readJSON);

	resetCanvas();
	readJSON();

	// create a population
	for (let i = 0; i < totalPop; i++) {
		let particle = new Particle();
		activeParticles[i] = particle;
		allParticles[i] = particle;
	}
	genCount++;
}

function preload() {
	myFont = loadFont("./resources/Roboto-Light.ttf");
}

function draw() {

	background(20);

	for (let i = 0; i < cyclePerFrame; i++) {
		for (let j = activeParticles.length - 1; j >= 0; j--) {
			let particle = activeParticles[j];
			// make the particle think
			particle.think(blocks);
			// update its position after it has thinked
			particle.update();

			// check if it has died
			if (!particle.alive) {
				activeParticles.splice(j, 1);
			}
		}
	}

	// find best score of this population
	let popHighScore = 0;
	let popBestParticle = null;
	for (let i = 0; i < activeParticles.length; i++) {
		let s = activeParticles[i].score;
		if (s > popHighScore) {
			popHighScore = s;
			popBestParticle = activeParticles[i];
		}
	}

	// check if its all time high score
	if (popHighScore > highScore) {
		highScore = popHighScore;
		bestParticle = popBestParticle;
	}

	// draw all blocks
	for (let block of blocks) {
		block.draw();
	}

	// draw all active birds
	for (let particle of activeParticles) {
		particle.draw();
	}

	// draw text 
	const t1 = "Generation: " + genCount.toString();
	const t2 = "Particles alive: " + activeParticles.length.toString() + "/" + totalPop.toString();
	const t3 = "Max Score: " + highScore.toString();

	push();
	fill(240);
	textFont(myFont);
	textSize(10);
	text(t1, 10, 20);
	text(t2, 10, 35);
	text(t3, 10, 50);
	pop();

	// check if all birds have dies.
	// then, create a new gen.
	if (activeParticles.length == 0) {
		console.log("high score is");
		console.log(highScore);
		nextGeneration();
		console.log("new gen created");
	}
}

function setSelectedMap() {
	switch (selectMap.value()) {
		case 'map1':
			selectedMapDir = './resources/maps/map1.json';
			break;
		case 'map2':
			selectedMapDir = './resources/maps/map2.json';
			break;
		case 'map3':
			selectedMapDir = './resources/maps/map3.json';
			break;
		case 'map4':
			selectedMapDir = './resources/maps/map4.json';
			break;
		default:
			selectedMapDir = './resources/maps/map1.json';
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

	//this.scene = new Scene(sceneW, sceneH, topViewW, 0);
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
		particle.speed = 2;
	}
	if (isDown) {
		particle.speed = 0;
	}
	if (isLeft) {
		particle.rotate(-2);
	}
	if (isRight) {
		particle.rotate(2);
	}
}

function checkBoundaries(x, y) {
	if (x < 0 || y < 0 || x > topViewW || y > topViewH) {
		return false;
	}
	return true;
}