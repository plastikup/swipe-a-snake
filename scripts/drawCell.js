import { ctx } from './canvasConfig.js';

const tilemap = new Image();
tilemap.src = '../tilemap.png';
let isTilemapLoaded = false;
let cellTypesJson;
export function drawCell(x, y, size, cellType) {
	if (!isTilemapLoaded) return;
	ctx.drawImage(tilemap, cellTypesJson[cellType].drawingReferenceCell.x * 8, cellTypesJson[cellType].drawingReferenceCell.y * 8, 8, 8, x - size / 2, y - size / 2, size, size);
}

async function init() {
	await fetch('/dictionaries/cellTypes.json')
		.then((res) => res.json())
		.then((levelsFetched) => {
			cellTypesJson = levelsFetched;
			isTilemapLoaded = true;
			console.log(cellTypesJson);
		})
		.catch((error) => {
			console.error('Error loading levels JSON:', error);
		});
}
init();
