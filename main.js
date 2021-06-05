let randomizer;
let shapes = [];
let meta;

/**
 * Preload function to fetch and organize data etc...
 *
 * You can load API data and any other data in this preload function, using p5js' `loadJSON`
 * -> https://p5js.org/reference/#/p5/loadJSON
 */
function preload() {
	const params =  new URLSearchParams(window.location.search);

	// current owner (if known, else default to 0x0)
	const owner = params.get('owner') || '0x0000000000000000000000000000000000000000';
	// viewer parameter (only if we know about it, else empty so we default to OxO)
	const viewer = params.get('viewer') || '0x0000000000000000000000000000000000000000';

	meta = {
		owner,
		viewer,
	}
}


function setup() {
	createCanvas(windowWidth, windowHeight)
	frameRate(30);

	start();
}

// this starts the sequence for determinsitic randommness
// every time we restart, the sequence will always be the same so the randomness will always be the same
// this has its own function so the sequence can restart if the window is resized
function start() {
	randomizer = new P5DeterministicRandomWithHexSeed(meta.owner);
	shapes = [];
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
	start();
}

function draw() {
	const shape = {
		x:  -0.5 + randomizer.random() * 1.5,
		y: -0.5 + randomizer.random() * 1.5,
		width: randomizer.random(),
		height: randomizer.random(),
		color: color(randomizer.random() * 256, randomizer.random() * 256, randomizer.random() * 256)
	};

	drawShape(shape);
}

function drawShape(shape) {
	fill(shape.color);
	rect(shape.x * width, shape.y * height, shape.width * width, shape.height * height);
}

class P5DeterministicRandomWithHexSeed {
	constructor(seed) {
		if (seed.startsWith('0x')) {
			seed = seed.substr(2);
		}
		this.seed = seed;
		this.seedIndex = 0;
		this.nextRandomSequence();
	}

	random() {
		return random();
	}

	nextRandomSequence() {
		// get current seed
		const e = this.seed.substr(this.seedIndex, 6);
		// increment seedIndex for later call
		this.seedIndex += 6;
		// if it's too near the end, add again and modulo
		if (this.seedIndex >= this.seed.length - 6) {
			this.seedIndex = (this.seedIndex + 6) % this.seed.length;
		}

		randomSeed(parseInt(e, 16))
	}
}
