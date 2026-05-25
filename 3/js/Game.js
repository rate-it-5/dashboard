import InputHandler from "./InputHandler.js";
import Player from "./Player.js";
import Platform from "./Platform.js";
import Collectible from "./Collectible.js";
import Hazard from "./Hazard.js";
import { isColliding, resolvePlatformCollision } from "./Collision.js";

export default class Game {
  constructor(canvas, elements) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");

    this.elements = elements;

    this.width = canvas.width;
    this.height = canvas.height;
    this.worldWidth = 2200;

    this.input = new InputHandler();
    this.player = new Player(80, 340);

    this.platforms = [];
    this.collectibles = [];
    this.hazards = [];

    this.finish = {
      x: 2070,
      y: 300,
      width: 48,
      height: 110
    };

    this.cameraX = 0;
    this.score = 0;
    this.frame = 0;

    this.isRunning = false;
    this.isPaused = false;
    this.isGameOver = false;
    this.isWin = false;

    this.createLevel();
    this.updateUI("Готово");
    this.draw();
  }

  createLevel() {
    this.platforms = [
      new Platform(0, 480, 420, 60),
      new Platform(470, 420, 220, 28),
      new Platform(760, 360, 220, 28),
      new Platform(1060, 430, 260, 28),
      new Platform(1380, 360, 240, 28),
      new Platform(1670, 300, 230, 28),
      new Platform(1950, 410, 250, 28),
      new Platform(2120, 480, 160, 60)
    ];

    this.collectibles = [
      new Collectible(240, 430),
      new Collectible(535, 370),
      new Collectible(835, 310),
      new Collectible(1165, 380),
      new Collectible(1470, 310),
      new Collectible(1750, 250),
      new Collectible(2030, 360)
    ];

    this.hazards = [
      new Hazard(420, 508, 72, 32),
      new Hazard(700, 508, 96, 32),
      new Hazard(1320, 508, 96, 32),
      new Hazard(1870, 508, 72, 32)
    ];
  }

  start() {
    if (this.isGameOver || this.isWin) {
      this.restart();
    }

    this.isRunning = true;
    this.isPaused = false;

    this.hideMessage();
    this.updateUI("Игра");

    this.loop();
  }

  pause() {
    if (!this.isRunning || this.isGameOver || this.isWin) {
      return;
    }

    this.isPaused = !this.isPaused;

    if (this.isPaused) {
      this.showMessage("Пауза", "Нажмите «Пауза» еще раз, чтобы продолжить.");
      this.updateUI("Пауза");
    } else {
      this.hideMessage();
      this.updateUI("Игра");
      this.loop();
    }
  }

  restart() {
    this.player.reset();

    this.score = 0;
    this.frame = 0;
    this.cameraX = 0;

    this.isRunning = false;
    this.isPaused = false;
    this.isGameOver = false;
    this.isWin = false;

    this.collectibles.forEach((item) => {
      item.collected = false;
    });

    this.hideMessage();
    this.updateUI("Готово");
    this.draw();
  }

  loop() {
    if (!this.isRunning || this.isPaused) {
      return;
    }

    this.update();
    this.draw();

    requestAnimationFrame(() => this.loop());
  }

    update() {
    this.frame += 1;

    this.player.update(this.input, this.worldWidth);

    this.handlePlatformCollisions();
    this.handleCollectibles();
    this.handleHazards();
    this.handleFall();
    this.handleFinish();

    this.collectibles.forEach((item) => {
        item.update(this.frame);
    });

    this.updateCamera();
    this.updateUI("Игра");
    }

  handlePlatformCollisions() {
    this.platforms.forEach((platform) => {
      resolvePlatformCollision(this.player, platform);
    });
  }

  handleCollectibles() {
    this.collectibles.forEach((collectible) => {
      if (!collectible.collected && isColliding(this.player, collectible.getBounds())) {
        collectible.collected = true;
        this.score += 100;
      }
    });
  }

  handleHazards() {
    this.hazards.forEach((hazard) => {
      if (isColliding(this.player, hazard)) {
        this.lose("Вы задели шипы. Нажмите «Рестарт», чтобы попробовать снова.");
      }
    });
  }

  handleFall() {
    if (this.player.y > this.height + 120) {
      this.lose("Персонаж упал вниз. Нажмите «Рестарт», чтобы начать заново.");
    }
  }

  handleFinish() {
    const totalCoins = this.collectibles.length;
    const collectedCoins = this.collectibles.filter((item) => item.collected).length;

    if (isColliding(this.player, this.finish)) {
      if (collectedCoins === totalCoins) {
        this.win();
      } else {
        this.showTemporaryMessage("Сначала соберите все кристаллы!");
      }
    }
  }

  showTemporaryMessage(text) {
    if (this.temporaryMessageTimer) {
      clearTimeout(this.temporaryMessageTimer);
    }

    this.elements.statusValue.textContent = text;

    this.temporaryMessageTimer = setTimeout(() => {
      if (this.isRunning && !this.isPaused) {
        this.updateUI("Игра");
      }
    }, 1200);
  }

  lose(message) {
    this.isRunning = false;
    this.isGameOver = true;
    this.updateUI("Поражение");
    this.showMessage("Игра окончена", message);
  }

  win() {
    this.isRunning = false;
    this.isWin = true;
    this.score += 500;
    this.updateUI("Победа");
    this.showMessage("Победа!", "Вы собрали все кристаллы и дошли до финиша.");
  }

  updateCamera() {
    const targetCameraX = this.player.x - this.width * 0.38;
    const maxCameraX = this.worldWidth - this.width;

    this.cameraX = Math.max(0, Math.min(targetCameraX, maxCameraX));
  }

  draw() {
    this.context.clearRect(0, 0, this.width, this.height);

    this.drawBackground();
    this.drawFinish();

    this.platforms.forEach((platform) => {
      platform.draw(this.context, this.cameraX);
    });

    this.hazards.forEach((hazard) => {
      hazard.draw(this.context, this.cameraX);
    });

    this.collectibles.forEach((collectible) => {
      collectible.draw(this.context, this.cameraX);
    });

    this.player.draw(this.context, this.cameraX);
  }

  drawBackground() {
    const gradient = this.context.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, "#10182a");
    gradient.addColorStop(1, "#0a0c12");

    this.context.fillStyle = gradient;
    this.context.fillRect(0, 0, this.width, this.height);

    this.drawParallaxLayer(0.16, "#1b2440", 120, 220);
    this.drawParallaxLayer(0.32, "#26304d", 230, 330);

    // Линия земли внизу
    this.context.fillStyle = "rgba(255, 255, 255, 0.04)";
    this.context.fillRect(0, 520, this.width, 20);
  }

  drawParallaxLayer(speed, color, baseY, height) {
    this.context.fillStyle = color;

    const offset = -(this.cameraX * speed) % 360;

    for (let i = -1; i < 5; i++) {
      const x = offset + i * 360;

      this.context.beginPath();
      this.context.moveTo(x, this.height);
      this.context.lineTo(x + 90, baseY + 40);
      this.context.lineTo(x + 180, baseY);
      this.context.lineTo(x + 280, baseY + 70);
      this.context.lineTo(x + 380, this.height);
      this.context.closePath();
      this.context.fill();
    }
  }

  drawFinish() {
    const drawX = this.finish.x - this.cameraX;

    this.context.fillStyle = "#35d39d";
    this.context.fillRect(drawX, this.finish.y, 8, this.finish.height);

    this.context.fillStyle = "#ffffff";
    this.context.fillRect(drawX + 8, this.finish.y, 38, 24);

    this.context.fillStyle = "#7c5cff";
    this.context.fillRect(drawX + 8, this.finish.y + 24, 38, 24);

    this.context.fillStyle = "#ffffff";
    this.context.font = "bold 14px Arial";
    this.context.fillText("FINISH", drawX - 8, this.finish.y - 10);
  }

  updateUI(statusText) {
    const totalCoins = this.collectibles.length;
    const collectedCoins = this.collectibles.filter((item) => item.collected).length;

    this.elements.scoreValue.textContent = this.score;
    this.elements.coinsValue.textContent = `${collectedCoins} / ${totalCoins}`;
    this.elements.statusValue.textContent = statusText;
  }

  showMessage(title, text) {
    this.elements.gameMessage.innerHTML = `
      <div>
        <h2>${title}</h2>
        <p>${text}</p>
      </div>
    `;

    this.elements.gameMessage.classList.remove("is-hidden");
  }

  hideMessage() {
    this.elements.gameMessage.classList.add("is-hidden");
  }
}