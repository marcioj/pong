import sounds from "./sounds.js";

export default class BasePlayer {
  constructor(game) {
    this.game = game;
    this.width = 30;
    this.height = 100;
    this.x = 0;
    this.y = 0;
    this.moveBy = 10;
  }
  moveUp() {
    sounds.move.play();
    this.y -= this.moveBy;
  }
  moveDown() {
    sounds.move.play();
    this.y += this.moveBy;
  }
  render() {
    this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
