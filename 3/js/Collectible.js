export default class Collectible {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 24;
    this.height = 24;
    this.collected = false;
    this.floatOffset = Math.random() * Math.PI * 2;
  }

  update(frame) {
    this.currentY = this.y + Math.sin(frame * 0.05 + this.floatOffset) * 5;
  }

  draw(context, cameraX) {
    if (this.collected) {
      return;
    }

    const drawX = this.x - cameraX;
    const drawY = this.currentY || this.y;

    context.save();
    context.translate(drawX + this.width / 2, drawY + this.height / 2);
    context.rotate(Math.PI / 4);

    context.fillStyle = "#ffd166";
    context.fillRect(-10, -10, 20, 20);

    context.fillStyle = "rgba(255, 255, 255, 0.45)";
    context.fillRect(-5, -8, 6, 6);

    context.restore();
  }

  getBounds() {
    return {
      x: this.x,
      y: this.currentY || this.y,
      width: this.width,
      height: this.height
    };
  }
}