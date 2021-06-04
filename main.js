let randomizer;
let shapes = [];
let meta;

/**
 * Preload function to fetch data etc...
 *
 * You should also be able to do calls to API etc...
 */
function preload() {
	const params =  new URLSearchParams(window.location.search);

	// current owner (if known, else default to 0x0)
	const owner = params.get('owner') || '0x0000000000000000000000000000000000000000';
	// viewer parameter (only if we know about it, else empty so we default to OxO)
	const viewer = params.get('viewer') || '0x0000000000000000000000000000000000000000';
	// tokenURI
	const tokenURI = params.get('tokenURI') || './__metadata.json';

	// locally metadata does not exist, you can set a default here if you need it
	let creator = '0x0000000000000000000000000000000000000000';
	let metadata = {
		creator
	};

	meta = {
		owner,
		viewer,
		creator,
		metadata,
	}

	// get metadata.json if exist
	const promise = new Promise((resolve, reject) => {
		fetch(tokenURI)
			.then(res => res.json)
			.then(resolve)
			.catch(reject)
	});

	loadPromiseAsync(promise, function(data) {
    meta.metadata = data;
  }, function(error) {
		console.log(error);
	});
}


/**
 * You actually can have an async setup, which is great if you need to load external data
 * like API data or maybe the NFT metadata using
 */
function setup() {

	createCanvas(windowWidth, windowHeight)
	frameRate(30);

	start();
}

// this create starts the sequence for determinsitic randommness
// every time we restart, the sequence will always be the same so the randomness will always be the same
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
		if (seed.indexOf('0x') === 0) {
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
