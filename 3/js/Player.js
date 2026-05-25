export default class Player {
  constructor(x, y) {
    this.startX = x;
    this.startY = y;

    this.x = x;
    this.y = y;
    this.previousY = y;

    this.width = 38;
    this.height = 54;

    this.velocityX = 0;
    this.velocityY = 0;

    this.speed = 4.4;
    this.jumpPower = 13;
    this.gravity = 0.58;
    this.friction = 0.82;

    this.isOnGround = false;
    this.facing = "right";
    this.animationFrame = 0;
  }

  reset() {
    this.x = this.startX;
    this.y = this.startY;
    this.previousY = this.startY;

    this.velocityX = 0;
    this.velocityY = 0;

    this.isOnGround = false;
    this.facing = "right";
    this.animationFrame = 0;
  }

    update(input, worldWidth) {
    this.previousY = this.y;

    if (input.keys.left) {
        this.velocityX = -this.speed;
        this.facing = "left";
    } else if (input.keys.right) {
        this.velocityX = this.speed;
        this.facing = "right";
    } else {
        this.velocityX *= this.friction;
    }

    if (input.keys.jump && this.isOnGround) {
        this.velocityY = -this.jumpPower;
    }

    this.isOnGround = false;

    this.velocityY += this.gravity;

    this.x += this.velocityX;
    this.y += this.velocityY;

    if (this.x < 0) {
        this.x = 0;
    }

    if (this.x + this.width > worldWidth) {
        this.x = worldWidth - this.width;
    }

    if (Math.abs(this.velocityX) > 0.3) {
        this.animationFrame += 0.18;
    }
    }

  draw(context, cameraX) {
    const drawX = this.x - cameraX;
    const drawY = this.y;

    const bob = this.isOnGround ? Math.sin(this.animationFrame) * 2 : 0;

    context.save();
    context.translate(drawX + this.width / 2, drawY + this.height / 2 + bob);

    if (this.facing === "left") {
      context.scale(-1, 1);
    }

    // Тень
    context.fillStyle = "rgba(0, 0, 0, 0.25)";
    context.beginPath();
    context.ellipse(0, this.height / 2 + 6, 24, 7, 0, 0, Math.PI * 2);
    context.fill();

    // Тело
    context.fillStyle = "#7c5cff";
    this.roundRect(context, -17, -18, 34, 38, 10);
    context.fill();

    // Голова
    context.fillStyle = "#f6c7a8";
    this.roundRect(context, -15, -34, 30, 26, 9);
    context.fill();

    // Волосы
    context.fillStyle = "#2b1b3f";
    this.roundRect(context, -15, -36, 30, 11, 7);
    context.fill();

    // Глаз
    context.fillStyle = "#111827";
    context.beginPath();
    context.arc(7, -23, 2.4, 0, Math.PI * 2);
    context.fill();

    // Ноги
    const legMove = Math.sin(this.animationFrame) * 4;

    context.fillStyle = "#35d39d";
    this.roundRect(context, -13, 18, 10, 18 + legMove, 5);
    context.fill();

    this.roundRect(context, 3, 18, 10, 18 - legMove, 5);
    context.fill();

    context.restore();
  }

  roundRect(context, x, y, width, height, radius) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
  }
}