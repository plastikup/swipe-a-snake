import { drawCell } from './drawCell.js';
import { calculateDimensions } from './sandbox.js';

export class Snake {
	constructor(snakeJson, gameSandbox) {
		this.gameSandbox = gameSandbox;
		this.snakeJson = snakeJson;
	}

	loop() {
        for (const cell of this.snakeJson) {
            drawCell(...calculateDimensions(cell.x, cell.y, this.gameSandbox), 's');
        }
    }
}
