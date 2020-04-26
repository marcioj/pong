import sounds from "./sounds";
import getControls from "./controls";
import List from "./list";
import PlayerSelectionScreen from "./player_selection_screen";
import { clamp } from "./utils";

function intersects(circle, rect) {
  let left = rect.x + rect.width > circle.x - circle.radius;
  let right = rect.x < circle.x + circle.radius;
  let top = rect.y < circle.y + circle.radius;
  let bottom = rect.y + rect.height > circle.y - circle.radius;
  return left && right && bottom && top;
}

export default class PongScreen {
  constructor(game) {
    sounds.background.play();
    this.game = game;
    this.state = "initial";
    this.players = [new Player(this.game), new Player(this.game)];
    this.ball = new Ball(this.game);
    this.score = new Score(this.game);
    this.divider = new Divider(this.game);
    this.startingPlayerIndex = 0;
    this.prevControls = getControls();
    this.pauseDialog = new PauseDialog(this.game, {
      onResume: () => {
        this.state = "playing";
      },
    });
    this.initialState();
  }
  getScreenControls() {
    const controls = getControls();
    const playMode = this.game.settings.playMode;
    if (playMode === "1p_1p") {
      return [controls[0], controls[0]];
    } else if (playMode === "multiplayer") {
      return controls;
    }
    return [controls[0], controls[0]];
  }
  get startingPlayer() {
    return this.players[this.startingPlayerIndex];
  }
  get objs() {
    return [
      ...this.players,
      this.ball,
      this.score,
      this.divider,
      this.pauseDialog,
    ];
  }
  initialState() {
    this.state = "initial";
    this.players[0].x = 0;
    this.players[0].y = this.game.height / 2 - this.players[0].height / 2; // center horizontally
    this.players[1].x = this.game.width - this.players[1].width;
    this.players[1].y = this.game.height / 2 - this.players[1].height / 2; // center horizontally
    this.ball.resetSpeed();
    this.centerBallRelativeToPlayer();
  }
  centerBallRelativeToPlayer() {
    const player = this.startingPlayer;
    if (player.x === 0) {
      this.ball.x = this.ball.radius + player.width;
      this.ball.y = player.y + player.height / 2;
    } else {
      this.ball.x = player.x - this.ball.radius;
      this.ball.y = player.y + player.height / 2;
    }
  }
  ensureRectBounds(rect) {
    rect.y = clamp(rect.y, 0, this.game.height - rect.height);
  }
  update() {
    const controls = this.getScreenControls();

    // FIXME: only the first player can pause. Putting this in the control loop causes the
    // state to change twice from initial, playing to paused
    if (this.prevControls[0].start && !controls[0].start) {
      if (this.state === "initial") {
        this.state = "playing";
      } else if (this.state === "playing") {
        this.state = "paused";
        this.pauseDialog.hidden = false;
      }
    }

    controls.forEach((control, i) => {
      // const prevControl = this.prevControls[i];
      const player = this.players[i];

      if (this.state !== "paused") {
        if (control.up) {
          player.moveUp();
          this.ensureRectBounds(player);
          if (this.state === "initial") {
            this.centerBallRelativeToPlayer();
          }
        } else if (control.down) {
          player.moveDown();
          this.ensureRectBounds(player);
          if (this.state === "initial") {
            this.centerBallRelativeToPlayer();
          }
        }
      }
    });

    if (this.state !== "paused") {
      this.handleBallPhysics();
    }

    this.objs.forEach((obj) => {
      if (obj.update) obj.update();
    });

    this.prevControls = this.getScreenControls();
  }
  handleBallPhysics() {
    if (this.state === "playing") {
      this.ball.move();
      // if the ball hits the upper or lower limits invert the vertical direction
      if (
        this.ball.y + this.ball.radius >= this.game.height ||
        this.ball.y - this.ball.radius <= 0
      ) {
        this.ball.ySpeed = -this.ball.ySpeed;
      }

      // if the ball hits the rectangle increases the speed and inverts the horizontal direction
      if (this.players.some((player) => intersects(this.ball, player))) {
        sounds.hit.play();
        this.ball.increaseSpeed();
        this.ball.xSpeed = -this.ball.xSpeed;
      } else {
        // if it touches the left or right border, someone scored one point
        if (this.ball.x <= this.ball.radius) {
          this.secondPlayerWins();
        } else if (this.ball.x + this.ball.radius >= this.game.width) {
          this.firstPlayerWins();
        }
      }
    }
  }
  secondPlayerWins() {
    this.score.rightScore += 1;
    this.startingPlayerIndex = 1;
    this.initialState();
  }
  firstPlayerWins() {
    this.score.leftScore += 1;
    this.startingPlayerIndex = 0;
    this.initialState();
  }
  render() {
    this.objs.forEach((obj) => obj.render(this.game));
  }
}

export class PauseDialog {
  constructor(game, { hidden = true, onResume }) {
    this.game = game;
    this.hidden = hidden;
    const xOffset = 40;
    const yOffset = 50;
    this.x = game.width / 3 + xOffset;
    this.y = game.height / 3 + yOffset;
    this.selectionList = new List(game.ctx, {
      items: [
        { id: "resume", text: "Resume" },
        { id: "quit", text: "Quit" },
      ],
      onSelect: (item) => {
        this.hidden = true;
        if (item.id === "quit") {
          game.changeScreen(PlayerSelectionScreen);
        } else {
          onResume();
        }
      },
    });
  }
  update() {
    if (this.hidden) return;
    const xOffset = 20;
    const yOffset = 40;
    this.selectionList.x = this.x + xOffset;
    this.selectionList.y = this.y + yOffset;
    this.selectionList.update();
  }
  render() {
    if (this.hidden) return;
    const game = this.game;
    game.ctx.font = "40px monospace";
    game.ctx.fillText("Paused", this.x, this.y);
    this.selectionList.render();
  }
}

class Divider {
  render(game) {
    game.ctx.beginPath();
    game.ctx.setLineDash([game.height / 15]);
    game.ctx.moveTo(game.width / 2, 0);
    game.ctx.lineTo(game.width / 2, game.height);
    game.ctx.stroke();
  }
}

class Score {
  constructor(game) {
    this.game = game;
    this.leftScore = 0;
    this.rightScore = 0;
  }
  render() {
    const game = this.game;
    const topOffset = 18;
    const y = game.height / 2 + topOffset;
    const leftOffset = -10;
    game.ctx.font = "50px monospace";
    game.ctx.fillText(this.leftScore, game.width / 4 + leftOffset, y);
    game.ctx.fillText(this.rightScore, (game.width / 4) * 3 + leftOffset, y);
  }
}

class Player {
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

class Ball {
  constructor(game) {
    this.game = game;
    this.radius = 15;
    this.x = 0;
    this.y = 0;
    this.speed = 3;
    this.resetSpeed();
  }
  move() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }
  resetSpeed() {
    this.xSpeed = this.speed;
    this.ySpeed = this.speed;
  }
  increaseSpeed() {
    this.xSpeed *= 1.1;
    this.ySpeed *= 1.1;
  }
  render() {
    const game = this.game;
    game.ctx.beginPath();
    game.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    game.ctx.fillStyle = "black";
    game.ctx.fill();
  }
}
