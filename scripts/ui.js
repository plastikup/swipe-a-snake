import { GAME_STATES, themeJson } from '../game.js';
import { ctx, canvasSize, gameFont } from './canvasConfig.js';
import { SANDBOX_MARGIN } from './sandbox.js';
import { drawCell } from './drawCell.js';

export class Ui {
	static gui = {};

	static intro(mouse) {
		let newGameState = GAME_STATES.intro
		const yShift = canvasSize / 12;

		//* title
		ctx.font = canvasSize / 12.8 + gameFont;
		ctx.fillStyle = themeJson.secondary;
		const title1Msmnt = measureText('-a-');
		ctx.fillText('-a-', canvasSize / 2 - title1Msmnt.w / 2, canvasSize / 4 + title1Msmnt.h / 2 + yShift);
		ctx.fillStyle = themeJson.primary;
		const title2Msmnt = measureText('swipe');
		ctx.fillText('swipe', canvasSize / 2 - title2Msmnt.w / 2, canvasSize / 4 + title2Msmnt.h / 2 - title1Msmnt.h + yShift);
		const title3Msmnt = measureText('snake');
		ctx.fillText('snake', canvasSize / 2 - title3Msmnt.w / 2, canvasSize / 4 + title3Msmnt.h / 2 + title1Msmnt.h + yShift);

		//* buttons
		const buttonHeight = ((Ui.gui.play.height / Ui.gui.play.width) * canvasSize) / 3;
		{
			const x = canvasSize / 2 - canvasSize / 6;
			const y = canvasSize / 2 + yShift;
			const w = canvasSize / 3;
			const h = buttonHeight;
			const hoverState = isInsideBox(x, y, w, h, mouse.x, mouse.y);
			ctx.drawImage(hoverState ? Ui.gui.playHover : Ui.gui.play, x, y, w, h + hoverState * 2);

			// if click on this button
			if (mouse.click && hoverState) newGameState = GAME_STATES.main;
		}
		{
			const x = canvasSize / 2 - canvasSize / 6 - buttonHeight * 1.25;
			const y = canvasSize / 2 + yShift;
			const hoverState = isInsideBox(x, y, buttonHeight, buttonHeight, mouse.x, mouse.y);
			ctx.drawImage(hoverState ? Ui.gui.levelSelectHover : Ui.gui.levelSelect, x, y, buttonHeight, buttonHeight);

			// if click on this button
			if (mouse.click && hoverState) newGameState = GAME_STATES.levelSelect;
		}
		{
			const x = canvasSize / 2 + buttonHeight * 1.25;
			const y = canvasSize / 2 + yShift;
			const hoverState = isInsideBox(x, y, buttonHeight, buttonHeight, mouse.x, mouse.y);
			ctx.drawImage(hoverState ? Ui.gui.soundOffHover : Ui.gui.soundOff, x, y, buttonHeight, buttonHeight);

			// if click on this button
			// TODO add music - if (mouse.click && hoverState)
		}

		return newGameState;
	}

	static main(currentGameState, currentLevel, snake, swipes, biscuits, swipesRequired) {
		//* level
		ctx.font = canvasSize * 0.024 + gameFont;
		ctx.fillStyle = themeJson.secondary;
		const levelMsmnt = measureText('level ' + currentLevel);
		ctx.fillText('level ' + currentLevel, canvasSize / 2 - levelMsmnt.w / 2, SANDBOX_MARGIN / 2 + levelMsmnt.h + 8);

		//* title
		ctx.font = canvasSize * 0.04 + gameFont;
		ctx.fillStyle = themeJson.primary;
		const titleMsmnt = measureText('Swipe-a-Snake');
		ctx.fillText('Swipe-a-Snake', canvasSize / 2 - titleMsmnt.w / 2, SANDBOX_MARGIN / 2 + 4);

		//* biscuits
		drawCell(canvasSize - 28, 28, 32, 'b', true);
		ctx.font = canvasSize * 0.024 + gameFont;
		ctx.fillStyle = themeJson.cookie;
		const biscuitMsmnt = measureText(biscuits);
		ctx.fillText(biscuits, canvasSize - 44 - biscuitMsmnt.w - 4, biscuitMsmnt.h / 2 + 28);

		//* bottom stats
		ctx.font = canvasSize * 0.024 + gameFont;
		ctx.fillStyle = themeJson.primary;
		// swipes
		const swipesDescriptionMsmnt = measureText('swipes');
		const swipesDatumMsmnt = measureText(swipes);
		// growth
		const growthDescriptionMsmnt = measureText('growth');
		const growthDatumMsmnt = measureText(snake.snakeJson.length);
		// swipes required
		const solvableDescriptionMsmnt = measureText('solvable in');
		const solvableDatumMsmnt = measureText(swipesRequired + ' moves');
		// calcs
		const evenSpacing = (canvasSize - (swipesDescriptionMsmnt.w + growthDescriptionMsmnt.w + solvableDescriptionMsmnt.w)) / 4;
		// draw
		ctx.fillText('swipes', evenSpacing, canvasSize - SANDBOX_MARGIN / 2 - 4);
		ctx.fillText(swipes, evenSpacing + swipesDescriptionMsmnt.w / 2 - swipesDatumMsmnt.w / 2, canvasSize - SANDBOX_MARGIN / 2 + swipesDatumMsmnt.h + 4);
		ctx.fillText('growth', swipesDescriptionMsmnt.w + 2 * evenSpacing, canvasSize - SANDBOX_MARGIN / 2 - 4);
		ctx.fillText(snake.snakeJson.length, swipesDescriptionMsmnt.w + 2 * evenSpacing + growthDescriptionMsmnt.w / 2 - growthDatumMsmnt.w / 2, canvasSize - SANDBOX_MARGIN / 2 + growthDatumMsmnt.h + 4);
		ctx.fillStyle = themeJson.secondary;
		ctx.fillText('solvable in', swipesDescriptionMsmnt.w + growthDescriptionMsmnt.w + 3 * evenSpacing, canvasSize - SANDBOX_MARGIN / 2 - 4);
		ctx.fillText(swipesRequired + ' moves', swipesDescriptionMsmnt.w + growthDescriptionMsmnt.w + 3 * evenSpacing + solvableDescriptionMsmnt.w / 2 - solvableDatumMsmnt.w / 2, canvasSize - SANDBOX_MARGIN / 2 + solvableDatumMsmnt.h + 4);
	}
}
Ui.gui.play = new Image();
Ui.gui.play.src = '../assets/GUI/Buttons/Rect/PlayText/Default.png';
Ui.gui.playHover = new Image();
Ui.gui.playHover.src = '../assets/GUI/Buttons/Rect/PlayText/Hover.png';
Ui.gui.levelSelect = new Image();
Ui.gui.levelSelect.src = '../assets/GUI/Buttons/Square/Levels/Default.png';
Ui.gui.levelSelectHover = new Image();
Ui.gui.levelSelectHover.src = '../assets/GUI/Buttons/Square/Levels/Hover.png';
Ui.gui.soundOff = new Image();
Ui.gui.soundOff.src = '../assets/GUI/Buttons/Square/SoundOff/Default.png';
Ui.gui.soundOffHover = new Image();
Ui.gui.soundOffHover.src = '../assets/GUI/Buttons/Square/SoundOff/Hover.png';

const measureText = (text) => {
	const metrics = ctx.measureText(text);
	return {
		w: metrics.width,
		h: metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent,
	};
};

const isInsideBox = (bx, by, bw, bh, mx, my) => Math.abs(bx + bw / 2 - mx) <= bw / 2 && Math.abs(by + bh / 2 - my) <= bh / 2;
