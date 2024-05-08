import { Sandbox } from './scripts/sandbox.js';
import { Snake } from './scripts/snake.js';
import { Ui } from './scripts/ui.js';

/* GLOB VARIABLES */
let allLevelsJson;
let currentLevel = 1;
let getCurrentLevelJson = () => allLevelsJson[currentLevel]; //! use gameSandbox.grid to access updated level data instead

export let cellTypesJson;
let gameSandbox;
let snake;

let swipes = 0;
let biscuits = +localStorage.getItem('biscuits') || 0;

export let themeJson;

/* GAME GESTURES */
// eslint-disable-next-line no-undef
const gest = new Hammer(document);
let panGesture = undefined;
let panGestureLock = false;
gest.on('panend', function (event) {
	if (event.additionalEvent === undefined || panGestureLock) return;
	switch (event.additionalEvent) {
		case 'panup':
			panGesture = 'N';
			break;
		case 'pandown':
			panGesture = 'S';
			break;
		case 'panleft':
			panGesture = 'W';
			break;

		case 'panright':
			panGesture = 'E';
			break;

		default:
			break;
	}

	panGestureLock = true;
});
document.addEventListener('keyup', function (event) {
	if (panGestureLock) return;
	switch (event.code) {
		case 'ArrowUp':
		case 'KeyW':
			panGesture = 'N';
			panGestureLock = true;
			break;
		case 'ArrowDown':
		case 'KeyS':
			panGesture = 'S';
			panGestureLock = true;
			break;
		case 'ArrowLeft':
		case 'KeyA':
			panGesture = 'W';
			panGestureLock = true;
			break;
		case 'ArrowRight':
		case 'KeyD':
			panGesture = 'E';
			panGestureLock = true;
			break;

		default:
			break;
	}
});

/* GAME */
export const GAME_STATES = {
	intro: 'intro',
	loading: 'loading',
	levelSelect: 'levelSelect',
	main: 'main',
};
let currentGameState = GAME_STATES.main;
function loop() {
	Ui.loop(currentGameState, currentLevel, snake, swipes, biscuits, getCurrentLevelJson().swipesRequired);

	//* loop the main cores of the game
	let endOfMovement;
	gameSandbox.loop();
	[panGesture, panGestureLock, biscuits, endOfMovement] = snake.loop(panGesture, panGestureLock, biscuits);
	swipes += +endOfMovement;

	//* for debug purposes only
	window.selfVars = {
		snake: snake,
		biscuits: biscuits,
		currentGameState: currentGameState,
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
	await fetch('/dictionaries/theme.json')
		.then((res) => res.json())
		.then((themeFetched) => {
			themeJson = themeFetched;
			console.log(themeJson);
		})
		.catch((error) => {
			console.error('Error loading levels JSON:', error);
		});

	gameSandbox = new Sandbox(getCurrentLevelJson().params.width, getCurrentLevelJson().params.height, getCurrentLevelJson().datum);
	snake = new Snake(getCurrentLevelJson().snake, gameSandbox);
	loop();
}
init();
