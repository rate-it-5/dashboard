export default class Hazard {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw(context, cameraX) {
    const drawX = this.x - cameraX;
    const spikeWidth = 24;
    const count = Math.floor(this.width / spikeWidth);

    context.fillStyle = "#ff6b6b";

    for (let i = 0; i < count; i++) {
      const spikeX = drawX + i * spikeWidth;

      context.beginPath();
      context.moveTo(spikeX, this.y + this.height);
      context.lineTo(spikeX + spikeWidth / 2, this.y);
      context.lineTo(spikeX + spikeWidth, this.y + this.height);
      context.closePath();
      context.fill();
    }
  }
}