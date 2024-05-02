import { ctx } from './canvasConfig.js';
import { cellTypesJson } from '../game.js';

const tilemap = new Image();
tilemap.src = '../tilemap.png';
export function drawCell(x, y, size, cellType) {
	const cellDictionary = cellTypesJson[cellType];
	size *= cellDictionary.drawingSizeRatio + (cellDictionary.collisionRule === 'collectible' ? (Math.sin(Date.now() / 400) - 1) * 0.1: 0);
	ctx.drawImage(tilemap, cellDictionary.drawingReferenceCell.x * 8, cellDictionary.drawingReferenceCell.y * 8, 8, 8, x - size / 2, y - size / 2, size, size);
}
