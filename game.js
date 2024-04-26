import { ctx, canvasSize } from './scripts/canvasConfig.js';
import { Sandbox } from './scripts/sandbox.js';
import { Snake } from './scripts/snake.js';

/* GLOB VARIABLES */
let allLevelsJson;
let currentLevel = 1;
let getCurrentLevelJson = () => allLevelsJson[currentLevel];

let gameSandbox;
let snake;

/* GAME */
let lastTS = 0;
let FPS = 60;
let delta = 1;
function loop(ts) {
	ctx.clearRect(0, 0, canvasSize, canvasSize);

	//* calculate the delta multiplier
	FPS = 1000 / (ts - lastTS) || 60;
	delta = 60 / FPS;
	lastTS = ts;

	//* loop the main cores of the game
	gameSandbox.loop();
	snake.loop();

	requestAnimationFrame(loop);
}

async function init() {
	await fetch('/dictionaries/levels.json')
		.then((res) => res.json())
		.then((levelsFetched) => {
			//levels = Object.values(levelsFetched);
			allLevelsJson = levelsFetched;
			console.log(allLevelsJson);
		})
		.catch((error) => {
			console.error('Error loading levels JSON:', error);
		});

	gameSandbox = new Sandbox(getCurrentLevelJson().params.width, getCurrentLevelJson().params.height, getCurrentLevelJson().datum);
	snake = new Snake(getCurrentLevelJson().snake, gameSandbox);
	loop();
}
init();
