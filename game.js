'use strict';
console.clear();

import { Sandbox } from './scripts/sandbox.js';
import { Snake } from './scripts/snake.js';
import { Ui } from './scripts/ui.js';
import { canvas, canvasSize, ctx } from './scripts/canvasConfig.js';

/* LEVEL PROGRESS */
// eslint-disable-next-line no-constant-condition
if (localStorage.getItem('levelProgress') === null || true) {
	//! remove constant condition in the future
	console.info('first time playing; setting brand new level progress JSON data');
	localStorage.setItem('levelProgress', JSON.stringify([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
}
const levelProgress = JSON.parse(localStorage.getItem('levelProgress'));
console.log(levelProgress);

/* GLOB VARIABLES */
let allLevelsJson;
let currentLevel = 1;
export let getCurrentLevelJson = () => JSON.parse(JSON.stringify(allLevelsJson[currentLevel])); //! use gameSandbox.grid to access updated level data instead

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
	document.getElementById('instructions').hidden = true
});

/* GAME */
export const GAME_STATES = {
	intro: 'intro',
	levelSelect: 'levelSelect',
	main: 'main',
	levelEnded: 'levelEnded',
};
let currentGameState = GAME_STATES.intro;
function loop() {
	//* UI
	switch (currentGameState) {
		case GAME_STATES.intro: {
			ctx.fillStyle = '#000';
			ctx.fillRect(0, 0, canvasSize, canvasSize);

			currentGameState = Ui.intro(mouse);

			if (currentGameState === GAME_STATES.main) {
				newLevel(currentLevel);
			}

			break;
		}

		case GAME_STATES.levelSelect: {
			ctx.fillStyle = '#000';
			ctx.fillRect(0, 0, canvasSize, canvasSize);

			let level;
			[currentGameState, level] = Ui.levelSelect(levelProgress, mouse);

			if (currentGameState === GAME_STATES.main) {
				newLevel(level);
			}

			break;
		}

		case GAME_STATES.levelEnded:
		case GAME_STATES.main: {
			ctx.fillStyle = '#000';
			ctx.fillRect(0, 0, canvasSize, canvasSize);
			Ui.main(currentLevel, snake, swipes, biscuits, getCurrentLevelJson().swipesRequired, getCurrentLevelJson().levelName);
			break;
		}

		default:
			break;
	}

	//* core
	switch (currentGameState) {
		case GAME_STATES.intro: {
			break;
		}

		case GAME_STATES.loading:
			break;

		case GAME_STATES.levelSelect:
			break;

		case GAME_STATES.main:
		case GAME_STATES.levelEnded: {
			//* loop the main cores of the game
			let endOfMovement = false;

			gameSandbox.loop();

			if (currentGameState === GAME_STATES.main) {
				[panGesture, panGestureLock, biscuits, endOfMovement, currentGameState] = snake.move(panGesture, biscuits, currentGameState);
			}
			snake.draw();

			newPan = false;
			swipes += +endOfMovement;

			break;
		}

		default:
			break;
	}

	//* apply level ended mask
	if (currentGameState === GAME_STATES.levelEnded) {
		let nextLevelShortcut = false;
		[currentGameState, nextLevelShortcut] = Ui.levelEnded(mouse);

		if (nextLevelShortcut) {
			newLevel(currentLevel + 1);
			currentGameState = GAME_STATES.main;
		}
	}

	//* draw the mouse
	ctx.drawImage(mouseImg, mouse.x, mouse.y, (canvasSize * 158) / 4800, (canvasSize * 254) / 4800);

	//* for debug purposes only
	window.selfVars = {
		snake: snake,
		biscuits: biscuits,
		currentGameState: currentGameState,
	};

	mouse.click = false;
	requestAnimationFrame(loop);
}

async function init() {
	await fetch('./dictionaries/levels.json')
		.then((res) => res.json())
		.then((levelsFetched) => {
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

	loop();
}
init();

function newLevel(level) {
	currentLevel = level;
	gameSandbox = new Sandbox(getCurrentLevelJson().params.width, getCurrentLevelJson().params.height, getCurrentLevelJson().datum);
	snake = new Snake(getCurrentLevelJson().snake, gameSandbox);

	newPan = false;
	panGesture = undefined;
	panGestureLock = false;

	swipes = 0;
}
