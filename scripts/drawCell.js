import { ctx } from './canvasConfig.js';
import { cellTypesJson } from '../game.js';

const tilemap = new Image();
tilemap.src = '../tilemap.png';
export function drawCell(x, y, size, cellType) {
	ctx.drawImage(tilemap, cellTypesJson[cellType].drawingReferenceCell.x * 8, cellTypesJson[cellType].drawingReferenceCell.y * 8, 8, 8, x - size / 2, y - size / 2, size, size);
}
