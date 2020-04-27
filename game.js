import PlayerSelectionScreen from "./player_selection_screen.js";

export default class Game {
  constructor(canvas) {
    canvas.style.border = "1px solid black";
    this.settings = {};
    this.ctx = canvas.getContext("2d");
    this.changeScreen(PlayerSelectionScreen);
  }
  changeScreen(screen, opts) {
    this.nextScreen = {
      screen,
      opts,
    };
  }
  get width() {
    return this.ctx.canvas.width;
  }
  get height() {
    return this.ctx.canvas.height;
  }
  clear() {
    // make sure we switch screens in the beginning of the frame
    if (this.nextScreen) {
      const { screen: Screen, opts } = this.nextScreen;
      this.currentScreen = new Screen(this, opts);
      this.nextScreen = null;
    }
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
  update() {
    this.currentScreen.update(this);
  }
  render() {
    this.currentScreen.render(this);
  }
  nextFrame() {
    this.clear();
    this.update();
    this.render();
  }
}
