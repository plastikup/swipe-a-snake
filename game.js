'use strict';
console.clear();

import { Sandbox } from './scripts/sandbox.js';
import { Snake } from './scripts/snake.js';
import { Ui } from './scripts/ui.js';
import { canvas, canvasSize, ctx } from './scripts/canvasConfig.js';

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
let newPan = false;
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

	newPan = true;
	panGestureLock = true;
});
document.addEventListener('keyup', function (event) {
	if (panGestureLock) return;
	switch (event.code) {
		case 'ArrowUp':
		case 'KeyW':
			newPan = true;
			panGesture = 'N';
			panGestureLock = true;
			break;
		case 'ArrowDown':
		case 'KeyS':
			newPan = true;
			panGesture = 'S';
			panGestureLock = true;
			break;
		case 'ArrowLeft':
		case 'KeyA':
			newPan = true;
			panGesture = 'W';
			panGestureLock = true;
			break;
		case 'ArrowRight':
		case 'KeyD':
			newPan = true;
			panGesture = 'E';
			panGestureLock = true;
			break;

		default:
			break;
	}
});

/* CURSOR */
const mouse = {
	click: false,
	x: canvasSize / 2,
	y: canvasSize / 2,
};
const mouseImg = new Image();
mouseImg.src = './assets/fancyCursor.png';
canvas.addEventListener('mousemove', function (event) {
	mouse.x = event.offsetX;
	mouse.y = event.offsetY;
});
document.addEventListener('click', function () {
	mouse.click = true;
});

/* GAME */
export const GAME_STATES = {
	intro: 'intro',
	loading: 'loading',
	levelSelect: 'levelSelect',
	main: 'main',
};
let currentGameState = GAME_STATES.intro;
function loop() {
	switch (currentGameState) {
		case GAME_STATES.intro: {
			ctx.fillStyle = '#000';
			ctx.fillRect(0, 0, canvasSize, canvasSize);
			currentGameState =  Ui.intro(mouse);
			break;
		}

		case GAME_STATES.loading: {
			ctx.fillStyle = '#000';
			ctx.fillRect(0, 0, canvasSize, canvasSize);
			break;
		}

		case GAME_STATES.levelSelect: {
			ctx.fillStyle = '#000';
			ctx.fillRect(0, 0, canvasSize, canvasSize);
			break;
		}

		case GAME_STATES.main: {
			ctx.fillStyle = '#000';
			ctx.fillRect(0, 0, canvasSize, canvasSize);
			Ui.main(currentGameState, currentLevel, snake, swipes, biscuits, getCurrentLevelJson().swipesRequired);
			break;
		}

		default:
			break;
	}
	mouse.click = false;

	switch (currentGameState) {
		case GAME_STATES.intro: {
			break;
		}

		case GAME_STATES.loading:
			break;

		case GAME_STATES.levelSelect:
			break;

		case GAME_STATES.main: {
			//* loop the main cores of the game
			let endOfMovement;
			gameSandbox.loop();
			[panGesture, panGestureLock, biscuits, endOfMovement] = snake.loop(panGesture, panGestureLock, biscuits);
			if (newPan) newPan = false;
			else swipes += +endOfMovement;
			break;
		}

		default:
			break;
	}

	//* draw the mouse
	ctx.drawImage(mouseImg, mouse.x, mouse.y, (canvasSize * 158) / 4800, (canvasSize * 254) / 4800);

	//* for debug purposes only
	window.selfVars = {
		snake: snake,
		biscuits: biscuits,
		currentGameState: currentGameState,
	};

	requestAnimationFrame(loop);
}

async function init() {
	await fetch('./dictionaries/levels.json')
		.then((res) => res.json())
		.then((levelsFetched) => {
			//levels = Object.values(levelsFetched);
			allLevelsJson = levelsFetched;
			console.log(allLevelsJson);
		})
		.catch((error) => {
			console.error('Error loading levels JSON:', error);
		});
	await fetch('./dictionaries/cellTypes.json')
		.then((res) => res.json())
		.then((levelsFetched) => {
			cellTypesJson = levelsFetched;
			console.log(cellTypesJson);
		})
		.catch((error) => {
			console.error('Error loading levels JSON:', error);
		});
	await fetch('./dictionaries/theme.json')
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
