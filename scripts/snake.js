import { drawCell } from './drawCell.js';
import { calculateDimensions } from './sandbox.js';
import { GAME_STATES, cellTypesJson, getCurrentLevelJson } from '../game.js';
import { Cell } from '../scripts/sandbox.js';

export class Snake {
	constructor(snakeJson, gameSandbox) {
		this.gameSandbox = gameSandbox;
		this.snakeJson = snakeJson;
		this.snakeDirection = 'E';
	}

	draw() {
		for (const cell of this.snakeJson) {
			if (cell.head) {
				drawCell(...calculateDimensions(cell.x, cell.y, this.gameSandbox), 'h' + this.snakeDirection);
			} else {
				drawCell(...calculateDimensions(cell.x, cell.y, this.gameSandbox), 's');
			}
		}
	}

	isSolidCollision = (cell, nextX, nextY) => this.snakeJson.filter((e) => e.x === nextX && e.y === nextY).length !== 0 || cellTypesJson[cell.datum.cellType].collisionRule === 'solid';

	move(panGesture, currentGameState, swipes) {
		if (panGesture !== undefined) {
			let starsGotten = 0;
			this.snakeDirection = panGesture;

			//* determine nextCell
			const displaceX = panGesture === 'E' || panGesture === 'W' ? (panGesture === 'E' ? 1 : -1) : 0;
			const displaceY = panGesture === 'N' || panGesture === 'S' ? (panGesture === 'S' ? 1 : -1) : 0;
			let nextX = this.snakeJson[0].x + displaceX;
			let nextY = this.snakeJson[0].y + displaceY;
			let nextCell = this.gameSandbox.grid[nextY][nextX];
			// if nextCell is a portal
			if (cellTypesJson[nextCell.datum.cellType].collisionRule === 'portal') {
				const portalTo = nextCell.datum.portalTo;
				let targetCell;

				for (const row of this.gameSandbox.grid) {
					const found = row.filter((cell) => cell.datum.portalId === portalTo);
					if (found.length !== 0) {
						targetCell = found[0];
						break;
					}
				}

				if (targetCell !== undefined) {
					nextX = targetCell.gx + displaceX;
					nextY = targetCell.gy + displaceY;
					nextCell = this.gameSandbox.grid[nextY][nextX];

					// if after portal the cell is a block, snake may go onto the portal
					if (this.isSolidCollision(nextCell, nextX, nextY)) {
						nextX = this.snakeJson[0].x + displaceX;
						nextY = this.snakeJson[0].y + displaceY;
						nextCell = this.gameSandbox.grid[nextY][nextX];
					}
				}
			}

			//* collision rules
			// exit if solid collision
			if (this.isSolidCollision(nextCell, nextX, nextY)) return [undefined, false, true, currentGameState, 0];
			// execute collectible rulesets
			if (cellTypesJson[nextCell.datum.cellType].collisionRule === 'collectible') {
				switch (nextCell.datum.cellType) {
					case 'b':
					case 'a':
						// apple
						this.snakeJson.push({ ...this.snakeJson[this.snakeJson.length] });
						break;
					case 'A':
						// golden apple
						this.snakeJson.push({ ...this.snakeJson[this.snakeJson.length] }, { ...this.snakeJson[this.snakeJson.length] });
						break;

					default:
						console.warn('unknown cellType.');
						break;
				}

				this.gameSandbox.grid[nextY][nextX] = new Cell(nextX, nextY, { cellType: 'e' }, this.gameSandbox, false);
			}

			//* trigger rule
			console.log(typeof nextCell.datum.trigger);
			if (typeof nextCell.datum.trigger === 'object') {
				const triggerDatum = nextCell.datum.trigger;

				switch (triggerDatum.triggerRule) {
					case 'replaceCell':
						this.gameSandbox.grid[triggerDatum.y][triggerDatum.x] = new Cell(triggerDatum.x, triggerDatum.y, triggerDatum.datum, this.gameSandbox, false);
						break;
					case 'nextLevel':
						console.warn('LEVEL ENDED!!');
						// stars
						if (getCurrentLevelJson().swipesRequired >= swipes + 1) starsGotten = 3;
						else if (getCurrentLevelJson().swipesRequired * 1.5 >= swipes + 1) starsGotten = 2;
						else starsGotten = 1;

						currentGameState = GAME_STATES.levelEnded;
						break;

					default:
						console.warn('unknown triggerRule.');
						break;
				}
			}

			//* max growth
			if (this.snakeJson.length >= getCurrentLevelJson()?.maxGrowth && typeof getCurrentLevelJson().maxGrowth === 'number') {
				console.warn('LEVEL ENDED!!');
				// stars
				if (getCurrentLevelJson().swipesRequired >= swipes + 1) starsGotten = 3;
				else if (getCurrentLevelJson().swipesRequired * 1.5 >= swipes + 1) starsGotten = 2;
				else starsGotten = 1;

				currentGameState = GAME_STATES.levelEnded;
			}

			//* displace the head of the snake
			this.snakeJson[0].head = false;
			this.snakeJson.unshift({
				x: nextX,
				y: nextY,
				head: true,
			});
			//* delete the tail of the snake
			this.snakeJson.pop();

			return [panGesture, true, currentGameState === GAME_STATES.levelEnded, currentGameState, starsGotten];
		} else return [panGesture, false, false, currentGameState, 0];
	}
}
