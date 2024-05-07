import { canvasSize } from './canvasConfig.js';
import { drawCell } from './drawCell.js';

export const SANDBOX_MARGIN = 96;
export class Sandbox {
	constructor(width, height, levelJson) {
		this.width = width;
		this.height = height;
		this.grid = [];

		for (let i = 0; i < this.height; i++) {
			this.grid[i] = [];
			for (let j = 0; j < this.width; j++) {
				this.grid[i][j] = new Cell(j, i, levelJson[i][j], this, true);
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
	constructor(gx, gy, datum, oo, isAnimated) {
		this.oo = oo;

		this.gx = gx;
		this.gy = gy;
		[this.x, this.y, this.size] = calculateDimensions(this.gx, this.gy, this.oo);

		this.animation = {
			enabled: isAnimated,
			animationSize: isAnimated ? 0 : 1,
			animationVelocity: 0,
			animationProgress: (this.gx + this.gy) * -1,
		};

		this.datum = datum;
	}

	draw() {
		drawCell(this.x, this.y, this.size * this.animation.animationSize, this.datum.cellType);

		if (this.animation.enabled) {
			if (this.animation.animationProgress >= 0) {
				this.animation.animationVelocity += (1 - this.animation.animationSize) * 0.1;
				this.animation.animationSize += this.animation.animationVelocity *= 0.8;
			}

			this.animation.animationProgress++;

			if (this.animation.animationProgress > 120) this.animation.enabled = false;
		}
	}
}

export function calculateDimensions(gx, gy, gameSandbox) {
	const size = (canvasSize - SANDBOX_MARGIN * 2) / Math.max(gameSandbox.width, gameSandbox.height);
	return [canvasSize / 2 + size * (gx - (gameSandbox.width - 1) / 2), canvasSize / 2 + size * (gy - (gameSandbox.height - 1) / 2), size];
}
