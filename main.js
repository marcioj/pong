import PongScreen from "./pong_screen";

class Game {
  constructor(canvas) {
    canvas.style.border = "1px solid black";
    this.ctx = canvas.getContext("2d");
    this.currentScreen = new PongScreen(this);
  }
  get width() {
    return this.ctx.canvas.width;
  }
  get height() {
    return this.ctx.canvas.height;
  }
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
  update() {
    this.currentScreen.update(this);
  }
  render() {
    this.currentScreen.render(this);
  }
}

function main() {
  const game = new Game(document.querySelector("#canvas"));

  requestAnimationFrame(function loop() {
    game.clear();
    game.update();
    game.render();
    requestAnimationFrame(loop);
  });
}

window.onload = main;
