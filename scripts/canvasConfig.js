const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d', { alpha: false });
const canvasScaleFactor = 2;

const canvasSize = Math.min(innerWidth, innerHeight);
canvas.width = canvasSize * canvasScaleFactor;
canvas.height = canvasSize * canvasScaleFactor;
canvas.style.width = canvasSize + 'px';
canvas.style.height = canvasSize + 'px';

ctx.fillStyle = '#FFF';
ctx.scale(canvasScaleFactor, canvasScaleFactor);

ctx.imageSmoothingEnabled = false;

export { canvas, ctx, canvasSize };
