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

/* GAME GESTURES */
// eslint-disable-next-line no-undef
const gest = new Hammer(canvas);
let panGesture = undefined;
let panGestureLock = false;
gest.on('panend', function (event) {
	if (event.additionalEvent === undefined || panGestureLock) return;

	switch (event.additionalEvent) {
		case 'panright':
			panGesture = 0;
			break;
		case 'panup':
			panGesture = 1;
			break;
		case 'panleft':
			panGesture = 2;
			break;
		case 'pandown':
			panGesture = 3;
			break;

		default:
			break;
	}
	panGestureLock = true;
	console.log(event);
});

/* GAME */
function loop() {
	ctx.clearRect(0, 0, canvasSize, canvasSize);

	//* loop the main cores of the game
	gameSandbox.loop();
	[panGesture, panGestureLock] = snake.loop(panGesture, panGestureLock);

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
