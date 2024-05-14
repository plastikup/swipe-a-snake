import { GAME_STATES, themeJson } from '../game.js';
import { ctx, canvasSize, gameFont, canvas } from './canvasConfig.js';
import { SANDBOX_MARGIN } from './sandbox.js';
import { drawCell } from './drawCell.js';

export class Ui {
	static gui = {};

	static intro(mouse) {
		let newGameState = GAME_STATES.intro;
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

	static levelSelect(levelProgress, mouse) {
		let newGameState = GAME_STATES.levelSelect;
		let newLevel;

		{
			//* title
			ctx.font = canvasSize * 0.04 + gameFont;
			ctx.fillStyle = themeJson.primary;
			const msmnt = measureText('Level Select');
			ctx.fillText('Level Select', canvasSize / 2 - msmnt.w / 2, SANDBOX_MARGIN / 2 + 4);
		}
		{
			//* note 1
			ctx.font = canvasSize * 0.018 + gameFont;
			ctx.fillStyle = themeJson.gray;
			const msmnt = measureText('all levels are unlocked by default');
			ctx.fillText('all levels are unlocked by default', canvasSize / 2 - msmnt.w / 2, canvasSize - SANDBOX_MARGIN / 2);
		}

		//* note 2
		ctx.font = canvasSize * 0.018 + gameFont;
		ctx.fillStyle = themeJson.gray;
		const noteMsmnt = measureText('your goal is to collect the most stars possible');
		ctx.fillText('your goal is to collect the most stars possible', canvasSize / 2 - noteMsmnt.w / 2, canvasSize - SANDBOX_MARGIN / 2 + noteMsmnt.h + 4);

		{
			//* levels board
			const levelDummyDimensions = {
				w: ((canvasSize / 3) * Ui.gui.levelDummy.width) / Ui.gui.levelDummy.height,
				h: canvasSize / 3,
			};
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 4; j++) {
					const dummyPosition = {
						tlx: canvasSize / 2 - levelDummyDimensions.w / 2 + ((j - 1.5) * (canvasSize - SANDBOX_MARGIN * 2)) / 3.25,
						tly: (SANDBOX_MARGIN / 2 + 4 + (canvasSize - SANDBOX_MARGIN / 2 - noteMsmnt.h)) / 2 - levelDummyDimensions.h / 2 + ((i - 1) * (canvasSize - SANDBOX_MARGIN * 2)) / 2.75,
					};
					dummyPosition.cx = dummyPosition.tlx + levelDummyDimensions.w / 2;
					dummyPosition.cy = dummyPosition.tly + levelDummyDimensions.h / 2;

					//* dummy
					const hoverState = isInsideBox(dummyPosition.cx - (levelDummyDimensions.w * 0.6) / 2, dummyPosition.cy - (levelDummyDimensions.h * 0.6) / 2, levelDummyDimensions.w * 0.6, levelDummyDimensions.h * 0.6, mouse.x, mouse.y);
					ctx.save();
					ctx.globalAlpha = hoverState ? 1 : 0.75;
					ctx.drawImage(Ui.gui.levelDummy, dummyPosition.tlx, dummyPosition.tly - levelDummyDimensions.h * 0.1, levelDummyDimensions.w, levelDummyDimensions.h);
					ctx.restore();
					// if click on this dummy
					if (mouse.click && hoverState) {
						newGameState = GAME_STATES.main;
						newLevel = i * 4 + j + 1;
					}

					{
						//* level id
						ctx.font = canvasSize * 0.08 + gameFont;
						ctx.fillStyle = themeJson.gray;
						const msmnt = measureText(i * 4 + j + 1);
						ctx.fillText(i * 4 + j + 1, dummyPosition.cx - msmnt.w / 2, dummyPosition.cy + msmnt.h / 2 - levelDummyDimensions.h * 0.075);
					}

					//* stars
					ctx.drawImage(Ui.gui['star' + levelProgress[i * 4 + j]], dummyPosition.cx - levelDummyDimensions.w * 0.3, dummyPosition.cy + levelDummyDimensions.h * 0.05, levelDummyDimensions.w * 0.6, (levelDummyDimensions.w * 0.6 * 32) / 77);
				}
			}
		}

		return [newGameState, newLevel];
	}

	static main(currentGameState, currentLevel, snake, swipes, biscuits, swipesRequired) {
		{
			//* level
			ctx.font = canvasSize * 0.024 + gameFont;
			ctx.fillStyle = themeJson.secondary;
			const msmnt = measureText('level ' + currentLevel);
			ctx.fillText('level ' + currentLevel, canvasSize / 2 - msmnt.w / 2, SANDBOX_MARGIN / 2 + msmnt.h + 8);
		}
		{
			//* title
			ctx.font = canvasSize * 0.04 + gameFont;
			ctx.fillStyle = themeJson.primary;
			const msmnt = measureText('Swipe-a-Snake');
			ctx.fillText('Swipe-a-Snake', canvasSize / 2 - msmnt.w / 2, SANDBOX_MARGIN / 2 + 4);
		}
		{
			//* biscuits
			drawCell(canvasSize - 28, 28, 32, 'b', true);
			ctx.font = canvasSize * 0.024 + gameFont;
			ctx.fillStyle = themeJson.cookie;
			const msmnt = measureText(biscuits);
			ctx.fillText(biscuits, canvasSize - 44 - msmnt.w - 4, msmnt.h / 2 + 28);
		}

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

Ui.gui.levelDummy = new Image();
Ui.gui.levelDummy.src = '../assets/GUI/Level/Button/Dummy.png';
Ui.gui.star0 = new Image();
Ui.gui.star0.src = '../assets/GUI/Level/Star/Group/0-3.png';
Ui.gui.star1 = new Image();
Ui.gui.star1.src = '../assets/GUI/Level/Star/Group/1-3.png';
Ui.gui.star2 = new Image();
Ui.gui.star2.src = '../assets/GUI/Level/Star/Group/2-3.png';
Ui.gui.star3 = new Image();
Ui.gui.star3.src = '../assets/GUI/Level/Star/Group/3-3.png';

const measureText = (text) => {
	const metrics = ctx.measureText(text);
	return {
		w: metrics.width,
		h: metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent,
	};
};

const isInsideBox = (bx, by, bw, bh, mx, my) => Math.abs(bx + bw / 2 - mx) <= bw / 2 && Math.abs(by + bh / 2 - my) <= bh / 2;
