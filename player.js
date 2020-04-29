import getControls from "./controls.js";
import BasePlayer from "./base_player.js";

const noop = () => {};

export default class Player extends BasePlayer {
  constructor(game, { controlIndex, onStart = noop }) {
    super(game);
    this.controlIndex = controlIndex;
    this.prevControl = this.getControl();
    this.onStart = onStart;
  }
  getControl() {
    return getControls()[this.controlIndex];
  }
  update() {
    const control = this.getControl();
    if (control.up) {
      this.moveUp();
    } else if (control.down) {
      this.moveDown();
    }

    if (this.prevControl.start && !control.start) {
      this.onStart();
    }

    this.prevControl = control;
  }
}
