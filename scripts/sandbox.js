import { canvasSize } from './canvasConfig.js';
import { drawCell } from './drawCell.js';

const MARGIN = 64;
export class Sandbox {
	constructor(width, height, levelJson) {
		this.width = width;
		this.height = height;
		this.grid = [];

		for (let i = 0; i < this.height; i++) {
			this.grid[i] = [];
			for (let j = 0; j < this.width; j++) {
				this.grid[i][j] = new Cell(j, i, levelJson[i][j], this);
			}
		}
	}

	loop() {
		for (const line of this.grid) {
			for (const cell of line) {
				cell.draw();
			}
		}
	}
}

export class Cell {
	constructor(gx, gy, cellType, oo) {
		this.oo = oo;

		this.gx = gx;
		this.gy = gy;
		[this.x, this.y, this.size] = calculateDimensions(this.gx, this.gy, this.oo);

		this.cellType = cellType;
	}

	draw() {
		/*
		ctx.fillStyle = '#FFF';
		ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size - 1, this.size - 1);
		*/
		drawCell(this.x, this.y, this.size, this.cellType);
	}
}

export function calculateDimensions(gx, gy, gameSandbox) {
	const size = (canvasSize - MARGIN * 2) / Math.max(gameSandbox.width, gameSandbox.height);
	return [canvasSize / 2 + size * (gx - (gameSandbox.width - 1) / 2), canvasSize / 2 + size * (gy - (gameSandbox.height - 1) / 2), size];
}
