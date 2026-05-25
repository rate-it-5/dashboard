export default class InputHandler {
  constructor() {
    this.keys = {
      left: false,
      right: false,
      jump: false
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);

    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  handleKeyDown(event) {
    if (event.code === "ArrowLeft" || event.code === "KeyA") {
      this.keys.left = true;
    }

    if (event.code === "ArrowRight" || event.code === "KeyD") {
      this.keys.right = true;
    }

    if (event.code === "ArrowUp" || event.code === "KeyW" || event.code === "Space") {
      this.keys.jump = true;
      event.preventDefault();
    }
  }

  handleKeyUp(event) {
    if (event.code === "ArrowLeft" || event.code === "KeyA") {
      this.keys.left = false;
    }

    if (event.code === "ArrowRight" || event.code === "KeyD") {
      this.keys.right = false;
    }

    if (event.code === "ArrowUp" || event.code === "KeyW" || event.code === "Space") {
      this.keys.jump = false;
    }
  }

  destroy() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  }
}