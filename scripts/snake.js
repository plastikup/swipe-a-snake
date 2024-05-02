import { drawCell } from './drawCell.js';
import { calculateDimensions } from './sandbox.js';
import { cellTypesJson } from '../game.js';
import { Cell } from '../scripts/sandbox.js';

export class Snake {
	constructor(snakeJson, gameSandbox) {
		this.gameSandbox = gameSandbox;
		this.snakeJson = snakeJson;
		this.snakeDirection = 'E';
	}

	loop(panGesture, panGestureLock, biscuits) {
		//* move the snake if applies
		[panGesture, panGestureLock, biscuits] = this.move(panGesture, biscuits);

		//* draw the snake
		for (const cell of this.snakeJson) {
			if (cell.head) {
				drawCell(...calculateDimensions(cell.x, cell.y, this.gameSandbox), 'h' + this.snakeDirection);
			} else {
				drawCell(...calculateDimensions(cell.x, cell.y, this.gameSandbox), 's');
			}
		}

		return [panGesture, panGestureLock, biscuits];
	}

	move(panGesture, biscuits) {
		if (panGesture !== undefined) {
			//* collision rules
			const nextX = this.snakeJson[0].x + (panGesture === 0 || panGesture === 2 ? (panGesture === 0 ? 1 : -1) : 0);
			const nextY = this.snakeJson[0].y + (panGesture === 1 || panGesture === 3 ? (panGesture === 3 ? 1 : -1) : 0);
			const nextCell = this.gameSandbox.grid[nextY][nextX];
			// exit if snake body
			if (this.snakeJson.filter((e) => e.x === nextX && e.y === nextY).length !== 0) return [undefined, false, biscuits];
			// exit if solid block
			if (cellTypesJson[nextCell.cellType].collisionRule === 'solid') return [undefined, false, biscuits];
			// execute collectible rulesets
			if (cellTypesJson[nextCell.cellType].collisionRule === 'collectible') {
				switch (nextCell.cellType) {
					case 'b':
						// biscuits
						biscuits++;
						break;

					default:
						console.warn('unknown cellType.');
						break;
				}
				this.gameSandbox.grid[nextY][nextX] = new Cell(nextX, nextY, 'e', this.gameSandbox);
			}

			//* displace the head of the snake
			this.snakeJson[0].head = false;
			this.snakeJson.unshift({
				'x': nextX,
				'y': nextY,
				'head': true,
			});

			//* delete the tail of the snake
			this.snakeJson.pop();

			console.log(this.snakeJson);
			return [panGesture, true, biscuits];
		} else return [panGesture, false, biscuits];
	}
}
