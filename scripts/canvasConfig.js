export const canvas = document.getElementById('game');
export const ctx = canvas.getContext('2d', { alpha: false });
const canvasScaleFactor = 2;

export const canvasSize = Math.min(innerWidth, innerHeight);
canvas.width = canvasSize * canvasScaleFactor;
canvas.height = canvasSize * canvasScaleFactor;
canvas.style.width = canvasSize + 'px';
canvas.style.height = canvasSize + 'px';

export const gameFont = "'Press Start 2P'";
ctx.font = '16px ' + gameFont;
ctx.fillStyle = '#FFF';
ctx.scale(canvasScaleFactor, canvasScaleFactor);

ctx.imageSmoothingEnabled = false;
