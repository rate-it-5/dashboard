export default class Platform {
  constructor(x, y, width, height, color = "#2a3346") {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  draw(context, cameraX) {
    const drawX = this.x - cameraX;

    context.fillStyle = this.color;
    context.fillRect(drawX, this.y, this.width, this.height);

    context.fillStyle = "rgba(255, 255, 255, 0.16)";
    context.fillRect(drawX, this.y, this.width, 6);
  }
}