import PlayerSelectionScreen from "./player_selection_screen";

export default class Game {
  constructor(canvas) {
    canvas.style.border = "1px solid black";
    this.settings = {};
    this.ctx = canvas.getContext("2d");
    this.changeScreen(PlayerSelectionScreen);
  }
  changeScreen(Screen, opts) {
    this.currentScreen = new Screen(this, opts);
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
