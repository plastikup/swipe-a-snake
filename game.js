import { canvas, ctx, canvasSize } from './scripts/canvasConfig.js';
import { Sandbox } from './scripts/sandbox.js';
import { Snake } from './scripts/snake.js';

/* GLOB VARIABLES */
let allLevelsJson;
let currentLevel = 1;
let getCurrentLevelJson = () => allLevelsJson[currentLevel]; //! use gameSandbox.grid to access updated level data instead

export let cellTypesJson;
let gameSandbox;
let snake;

let biscuits = +localStorage.getItem('biscuits') || 0;

/* GAME GESTURES */
// eslint-disable-next-line no-undef
const gest = new Hammer(document);
let panGesture = undefined;
let panGestureLock = false;
gest.on('panend', function (event) {
	if (event.additionalEvent === undefined || panGestureLock) return;

	switch (event.additionalEvent) {
		case 'panright':
			panGesture = 'E';
			break;
		case 'panup':
			panGesture = 'N';
			break;
		case 'panleft':
			panGesture = 'W';
			break;
		case 'pandown':
			panGesture = 'S';
			break;

		default:
			break;
	}
	
	panGestureLock = true;
});

/* GAME */
function loop() {
	ctx.clearRect(0, 0, canvasSize, canvasSize);

	//* loop the main cores of the game
	gameSandbox.loop();
	[panGesture, panGestureLock, biscuits] = snake.loop(panGesture, panGestureLock, biscuits);

	//* for debug purposes only
	window.selfVars = {
		snake: snake,
		biscuits: biscuits,
	};

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
	await fetch('/dictionaries/cellTypes.json')
		.then((res) => res.json())
		.then((levelsFetched) => {
			cellTypesJson = levelsFetched;
			console.log(cellTypesJson);
		})
		.catch((error) => {
			console.error('Error loading levels JSON:', error);
		});

	gameSandbox = new Sandbox(getCurrentLevelJson().params.width, getCurrentLevelJson().params.height, getCurrentLevelJson().datum);
	snake = new Snake(getCurrentLevelJson().snake, gameSandbox);
	loop();
}
init();
