import { GAME_STATES, themeJson } from '../game.js';
import { ctx, canvasSize, gameFont } from './canvasConfig.js';
import { SANDBOX_MARGIN } from './sandbox.js';
import { drawCell } from './drawCell.js';

export class Ui {
	static loop(currentGameState, currentLevel, snake, swipes, biscuits, swipesRequired) {
		switch (currentGameState) {
			case GAME_STATES.intro:
				ctx.clearRect(0, 0, canvasSize, canvasSize);
				break;
			case GAME_STATES.loading:
				ctx.clearRect(0, 0, canvasSize, canvasSize);
				break;
			case GAME_STATES.levelSelect:
				ctx.clearRect(0, 0, canvasSize, canvasSize);
				break;
			case GAME_STATES.main: {
				ctx.clearRect(0, 0, canvasSize, canvasSize);

				//* level
				ctx.font = '16px ' + gameFont;
				ctx.fillStyle = themeJson.secondary;
				const levelMeasurement = measureText('level ' + currentLevel);
				ctx.fillText('level ' + currentLevel, canvasSize / 2 - levelMeasurement.w / 2, SANDBOX_MARGIN / 2 + levelMeasurement.h + 8);

				//* title
				ctx.font = '30px ' + gameFont;
				ctx.fillStyle = themeJson.primary;
				const titleMeasurement = measureText('Swipe-a-Snake');
				ctx.fillText('Swipe-a-Snake', canvasSize / 2 - titleMeasurement.w / 2, SANDBOX_MARGIN / 2 + 4);

				//* biscuits
				drawCell(canvasSize - 28, 28, 32, 'b', true);
				ctx.font = '24px ' + gameFont;
				ctx.fillStyle = themeJson.cookie;
				const biscuitMeasurement = measureText(biscuits);
				ctx.fillText(biscuits, canvasSize - 44 - biscuitMeasurement.w - 4, biscuitMeasurement.h / 2 + 28);

				//* bottom stats
				ctx.font = '16px ' + gameFont;
				ctx.fillStyle = themeJson.primary;
				// swipes
				const swipesDescriptionMeasurement = measureText('swipes');
				const swipesDatumMeasurement = measureText(swipes);
				// growth
				const growthDescriptionMeasurement = measureText('growth');
				const growthDatumMeasurement = measureText(snake.snakeJson.length);
				// swipes required
				const solvableDescriptionMeasurement = measureText('solvable in');
				const solvableDatumMeasurement = measureText(swipesRequired + ' moves');
				// calcs
				const evenSpacing = (canvasSize - (swipesDescriptionMeasurement.w + growthDescriptionMeasurement.w + solvableDescriptionMeasurement.w)) / 4;
				// draw
				ctx.fillText('swipes', evenSpacing, canvasSize - SANDBOX_MARGIN / 2 - 4);
				ctx.fillText(swipes, evenSpacing + swipesDescriptionMeasurement.w / 2 - swipesDatumMeasurement.w / 2, canvasSize - SANDBOX_MARGIN / 2 + swipesDatumMeasurement.h + 4);
				ctx.fillText('growth', swipesDescriptionMeasurement.w + 2 * evenSpacing, canvasSize - SANDBOX_MARGIN / 2 - 4);
				ctx.fillText(snake.snakeJson.length, swipesDescriptionMeasurement.w + 2 * evenSpacing + growthDescriptionMeasurement.w / 2 - growthDatumMeasurement.w / 2, canvasSize - SANDBOX_MARGIN / 2 + growthDatumMeasurement.h + 4);
				ctx.fillStyle = themeJson.secondary;
				ctx.fillText('solvable in', swipesDescriptionMeasurement.w + growthDescriptionMeasurement.w + 3 * evenSpacing, canvasSize - SANDBOX_MARGIN / 2 - 4);
				ctx.fillText(swipesRequired + ' moves', swipesDescriptionMeasurement.w + growthDescriptionMeasurement.w + 3 * evenSpacing + solvableDescriptionMeasurement.w / 2 - solvableDatumMeasurement.w / 2, canvasSize - SANDBOX_MARGIN / 2 + solvableDatumMeasurement.h + 4);
				break;
			}

			default:
				break;
		}
	}
}

const measureText = (text) => {
	const metrics = ctx.measureText(text);
	return {
		w: metrics.width,
		h: metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent,
	};
};
