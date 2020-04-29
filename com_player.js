import { roundUpToNextMultiple, rand } from "./utils.js";
import BasePlayer from "./base_player.js";

export default class COMPlayer extends BasePlayer {
  constructor(game, { pongScreen }) {
    super(game);
    this.game = game;
    this.pongScreen = pongScreen;
  }
  update() {
    if (
      this.pongScreen.state === "initial" &&
      this.pongScreen.startingPlayerIndex === 1
    ) {
      // TODO: do some random things before throwing the ball to feel more natural
      this.pongScreen.changeState("playing");
      return;
    } else if (this.pongScreen.state === "playing") {
      // Without the roundUp, the COM this will have a shaking effect
      const ballCenter = roundUpToNextMultiple(
        this.pongScreen.ball.y - this.height / 2,
        this.moveBy
      );

      // This determine how smart the COM is
      const doTheRightMove = rand(0, 1) === 1;

      if (this.pongScreen.ball.xSpeed > 0 && doTheRightMove) {
        if (ballCenter < this.y) {
          this.moveUp();
        } else if (ballCenter > this.y) {
          this.moveDown();
        }
      }
    }
  }
}
