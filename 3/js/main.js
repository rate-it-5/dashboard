import Game from "./Game.js";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");

  const elements = {
    scoreValue: document.getElementById("scoreValue"),
    coinsValue: document.getElementById("coinsValue"),
    statusValue: document.getElementById("statusValue"),
    gameMessage: document.getElementById("gameMessage")
  };

  const startBtn = document.getElementById("startBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const restartBtn = document.getElementById("restartBtn");

  const game = new Game(canvas, elements);

  startBtn.addEventListener("click", () => {
    game.start();
  });

  pauseBtn.addEventListener("click", () => {
    game.pause();
  });

  restartBtn.addEventListener("click", () => {
    game.restart();
  });
});