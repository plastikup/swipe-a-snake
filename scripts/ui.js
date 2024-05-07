import { GAME_STATES } from '../game.js';
import { ctx, canvasSize, gameFont } from './canvasConfig.js';
import { SANDBOX_MARGIN } from './sandbox.js';
import { drawCell } from './drawCell.js';

export class Ui {
	static loop(currentGameState, currentLevel, snake, swipes, biscuits) {
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
				const levelMeasurement = measureText('level ' + currentLevel);
				ctx.fillText('level ' + currentLevel, canvasSize / 2 - levelMeasurement.w / 2, SANDBOX_MARGIN / 2 + levelMeasurement.h + 8);

				//* title
				ctx.font = '30px ' + gameFont;
				const titleMeasurement = measureText('Swipe-a-Snake');
				ctx.fillText('Swipe-a-Snake', canvasSize / 2 - titleMeasurement.w / 2, SANDBOX_MARGIN / 2 + 4);

				//* biscuits
				drawCell(canvasSize - 28, 28, 32, 'b', true);

				ctx.font = '24px ' + gameFont;
				const biscuitMeasurement = measureText(biscuits);
				ctx.fillText(biscuits, canvasSize - 44 - biscuitMeasurement.w, biscuitMeasurement.h / 2 + 28);

				//* bottom stats
				for (let i = 0; i < 2; i++) {
					const description = ['swipes', 'growth'][i];
					const datum = [swipes, snake.snakeJson.length][i];
					const xPos = canvasSize / 2 + (i - 0.5) * canvasSize * 0.3;

					// description
					ctx.font = '16px ' + gameFont;
					const descriptionMeasurement = measureText(description);
					ctx.fillText(description, xPos - descriptionMeasurement.w / 2, canvasSize - SANDBOX_MARGIN / 2 - 4);

					// datum
					ctx.font = '16px ' + gameFont;
					const datumMeasurement = measureText(datum);
					ctx.fillText(datum, xPos - datumMeasurement.w / 2, canvasSize - SANDBOX_MARGIN / 2 + datumMeasurement.h + 4);
				}
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
