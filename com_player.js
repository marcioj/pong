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
      // Without the roundUp, the COM will have a shaking effect
      const playerCenter = roundUpToNextMultiple(
        this.y + this.height / 2,
        this.moveBy
      );
      const ball = this.pongScreen.ball;
      const ballCenter = roundUpToNextMultiple(ball.y, this.moveBy);

      // This determine how smart the COM is
      const doTheRightMove = rand(0, 1) === 1;
      // Follow the ball if it goes towards the player
      if (ball.xSpeed > 0) {
        if (doTheRightMove) {
          if (playerCenter < ballCenter) {
            this.moveDown();
          } else if (playerCenter > ballCenter) {
            this.moveUp();
          }
        }
        // Otherwise return to the center
      } else {
        const screenCenter = roundUpToNextMultiple(
          this.game.height / 2,
          this.moveBy
        );
        if (playerCenter < screenCenter) {
          this.moveDown();
        } else if (playerCenter > screenCenter) {
          this.moveUp();
        }
      }
    }
  }
}
