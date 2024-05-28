import { GAME_STATES, themeJson } from '../game.js';
import { ctx, canvasSize, gameFont } from './canvasConfig.js';
import { SANDBOX_MARGIN } from './sandbox.js';
import { drawCell } from './drawCell.js';

export class Ui {
	static gui = {};

	static intro(mouse) {
		let newGameState = GAME_STATES.intro;
		const yShift = canvasSize / 12;
		const buttonHeight = ((Ui.gui.play.height / Ui.gui.play.width) * canvasSize) / 3;

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
		{
			const x = canvasSize / 2 - canvasSize / 6;
			const y = canvasSize / 2 + yShift;
			const w = canvasSize / 3;
			const h = buttonHeight;
			const hoverState = isInsideBox(x, y, w, h, mouse.x, mouse.y);
			ctx.drawImage(hoverState ? Ui.gui.playHover : Ui.gui.play, x, y, w, h + hoverState * 2);

			// if click on this button
			if (mouse.click && hoverState) {
				newGameState = GAME_STATES.levelSelect;
				document.getElementById('instructions').hidden = true;
			}
		}
		{
			const x = canvasSize / 2 - canvasSize / 6 - buttonHeight * 1.25;
			const y = canvasSize / 2 + yShift;
			const hoverState = isInsideBox(x, y, buttonHeight, buttonHeight, mouse.x, mouse.y);
			ctx.drawImage(hoverState ? Ui.gui.helpHover : Ui.gui.help, x, y, buttonHeight, buttonHeight);

			// if click on this button
			if (mouse.click && hoverState) {
				document.getElementById('instructions').hidden = !document.getElementById('instructions').hidden;
			}
		}
		{
			const x = canvasSize / 2 + buttonHeight * 1.25;
			const y = canvasSize / 2 + yShift;
			const hoverState = isInsideBox(x, y, buttonHeight, buttonHeight, mouse.x, mouse.y);
			if (Ui.music.paused) {
				ctx.drawImage(hoverState ? Ui.gui.soundOffHover : Ui.gui.soundOff, x, y, buttonHeight, buttonHeight);
			} else {
				ctx.drawImage(hoverState ? Ui.gui.soundOnHover : Ui.gui.soundOn, x, y, buttonHeight, buttonHeight);
			}

			// if click on this button
			if (mouse.click && hoverState) {
				if (Ui.music.paused) {
					Ui.music.play();
					Ui.music.loop = true;
					Ui.music.volume = 0.5;
				} else {
					Ui.music.pause();
				}
			}
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
				for (let j = 0; j < 3; j++) {
					const dummyPosition = {
						tlx: canvasSize / 2 - levelDummyDimensions.w / 2 + ((j - 1) * (canvasSize - SANDBOX_MARGIN * 2)) / 3.25,
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
						newLevel = i * 3 + j + 1;
					}

					{
						//* level id
						ctx.font = canvasSize * 0.08 + gameFont;
						ctx.fillStyle = themeJson.gray;
						const msmnt = measureText(i * 3 + j + 1);
						ctx.fillText(i * 3 + j + 1, dummyPosition.cx - msmnt.w / 2, dummyPosition.cy + msmnt.h / 2 - levelDummyDimensions.h * 0.075);
					}

					//* stars
					ctx.drawImage(Ui.gui['star' + levelProgress[i * 3 + j]], dummyPosition.cx - levelDummyDimensions.w * 0.3, dummyPosition.cy + levelDummyDimensions.h * 0.05, levelDummyDimensions.w * 0.6, (levelDummyDimensions.w * 0.6 * 32) / 77);
				}
			}
		}

		return [newGameState, newLevel];
	}

	static main(currentLevel, snake, swipes, biscuits, swipesRequired, levelName) {
		{
			//* level
			ctx.font = canvasSize * 0.024 + gameFont;
			ctx.fillStyle = themeJson.secondary;
			const msmnt = measureText(`level ${currentLevel}: ${levelName}`);
			ctx.fillText(`level ${currentLevel}: ${levelName}`, canvasSize / 2 - msmnt.w / 2, SANDBOX_MARGIN / 2 + msmnt.h + 8);
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

	static levelEnded(mouse) {
		let newGameState = GAME_STATES.levelEnded;
		let nextLevelShortcut = false;

		ctx.fillStyle = '#000A';
		ctx.fillRect(0, 0, canvasSize, canvasSize);

		const buttonHeight = ((Ui.gui.play.height / Ui.gui.play.width) * canvasSize) / 3;
		const yShift = canvasSize / 12;

		//* title
		ctx.font = canvasSize / 12.8 + gameFont;
		ctx.fillStyle = themeJson.primary;
		const title1Msmnt = measureText('level');
		ctx.fillText('level', canvasSize / 2 - title1Msmnt.w / 2, canvasSize / 4 + title1Msmnt.h / 2 - title1Msmnt.h);
		ctx.fillStyle = themeJson.secondary;
		const title2Msmnt = measureText('completed');
		ctx.fillText('completed', canvasSize / 2 - title2Msmnt.w / 2, canvasSize / 4 + title2Msmnt.h / 2);

		//* stars
		{
			const starsY = (canvasSize / 4 + title2Msmnt.h + canvasSize / 2 + yShift) / 2;

			ctx.drawImage(Ui.gui.starActive, canvasSize / 2 - buttonHeight * 1.4, starsY - buttonHeight * 0.45, buttonHeight, buttonHeight);
			ctx.drawImage(Ui.gui.starActive, canvasSize / 2 - buttonHeight * 0.5, starsY - buttonHeight * 0.55, buttonHeight, buttonHeight);
			ctx.drawImage(Ui.gui.starInactive, canvasSize / 2 + buttonHeight * 0.4, starsY - buttonHeight * 0.45, buttonHeight, buttonHeight);
		}

		//* buttons
		{
			const x = canvasSize / 2 - buttonHeight * 1.75;
			const y = canvasSize / 2 + yShift;
			const hoverState = isInsideBox(x, y, buttonHeight, buttonHeight, mouse.x, mouse.y);

			ctx.drawImage(hoverState ? Ui.gui.homeHover : Ui.gui.home, x, y, buttonHeight, buttonHeight);

			if (mouse.click && hoverState) {
				newGameState = GAME_STATES.intro;
			}
		}
		{
			const x = canvasSize / 2 - buttonHeight * 0.5;
			const y = canvasSize / 2 + yShift;
			const hoverState = isInsideBox(x, y, buttonHeight, buttonHeight, mouse.x, mouse.y);

			ctx.drawImage(hoverState ? Ui.gui.play2Hover : Ui.gui.play2, x, y, buttonHeight, buttonHeight);

			if (mouse.click && hoverState) {
				nextLevelShortcut = true;
			}
		}
		{
			const x = canvasSize / 2 + buttonHeight * 0.75;
			const y = canvasSize / 2 + yShift;
			const hoverState = isInsideBox(x, y, buttonHeight, buttonHeight, mouse.x, mouse.y);

			ctx.drawImage(hoverState ? Ui.gui.levelSelect2Hover : Ui.gui.levelSelect2, x, y, buttonHeight, buttonHeight);

			if (mouse.click && hoverState) {
				newGameState = GAME_STATES.levelSelect;
			}
		}

		//* return
		return [newGameState, nextLevelShortcut];
	}
}

Ui.gui.play = new Image();
Ui.gui.play.src = '../assets/GUI/Buttons/Rect/PlayText/Default.png';

Ui.gui.playHover = new Image();
Ui.gui.playHover.src = '../assets/GUI/Buttons/Rect/PlayText/Hover.png';
Ui.gui.help = new Image();
Ui.gui.help.src = '../assets/GUI/Buttons/Square/Help/Default.png';
Ui.gui.helpHover = new Image();
Ui.gui.helpHover.src = '../assets/GUI/Buttons/Square/Help/Hover.png';
Ui.gui.soundOff = new Image();
Ui.gui.soundOff.src = '../assets/GUI/Buttons/Square/SoundOff/Default.png';
Ui.gui.soundOffHover = new Image();
Ui.gui.soundOffHover.src = '../assets/GUI/Buttons/Square/SoundOff/Hover.png';
Ui.gui.soundOn = new Image();
Ui.gui.soundOn.src = '../assets/GUI/Buttons/Square/SoundOn/Default.png';
Ui.gui.soundOnHover = new Image();
Ui.gui.soundOnHover.src = '../assets/GUI/Buttons/Square/SoundOn/Hover.png';

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

Ui.gui.home = new Image();
Ui.gui.home.src = '../assets/GUI/Buttons/Square/Home/Default.png';
Ui.gui.homeHover = new Image();
Ui.gui.homeHover.src = '../assets/GUI/Buttons/Square/Home/Hover.png';
Ui.gui.play2 = new Image();
Ui.gui.play2.src = '../assets/GUI/Buttons/Square/Play/Default.png';
Ui.gui.play2Hover = new Image();
Ui.gui.play2Hover.src = '../assets/GUI/Buttons/Square/Play/Hover.png';
Ui.gui.levelSelect2 = new Image();
Ui.gui.levelSelect2.src = '../assets/GUI/Buttons/Square/Levels/Default.png';
Ui.gui.levelSelect2Hover = new Image();
Ui.gui.levelSelect2Hover.src = '../assets/GUI/Buttons/Square/Levels/Hover.png';

Ui.gui.starActive = new Image();
Ui.gui.starActive.src = '../assets/GUI/Level/Star/Active.png';
Ui.gui.starInactive = new Image();
Ui.gui.starInactive.src = '../assets/GUI/Level/Star/Unactive.png';

Ui.music = new Audio('../assets/music.mp3');

const measureText = (text) => {
	const metrics = ctx.measureText(text);
	return {
		w: metrics.width,
		h: metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent,
	};
};

const isInsideBox = (bx, by, bw, bh, mx, my) => Math.abs(bx + bw / 2 - mx) <= bw / 2 && Math.abs(by + bh / 2 - my) <= bh / 2;
