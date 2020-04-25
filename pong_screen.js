import sounds from "./sounds";
import controls from "./controls";

let prevControls = controls;

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
    this.firstPlayer = new Player();
    this.secondPlayer = new Player();
    this.ball = new Ball();
    this.score = new Score();
    this.divider = new Divider();
    this.initialState();
  }
  get objs() {
    return [
      this.firstPlayer,
      this.secondPlayer,
      this.ball,
      this.score,
      this.divider,
    ];
  }
  initialState() {
    this.state = "initial";
    this.firstPlayer.x = 0;
    this.firstPlayer.y = this.game.height / 2 - this.firstPlayer.height / 2; // center horizontally
    this.secondPlayer.x = this.game.width - this.secondPlayer.width;
    this.secondPlayer.y = this.game.height / 2 - this.secondPlayer.height / 2; // center horizontally
    this.ball.x = this.ball.radius + this.firstPlayer.width;
    this.ball.resetSpeed();
    this.centerBallRelativeToPlayer();
  }
  centerBallRelativeToPlayer() {
    this.ball.y = this.firstPlayer.y + this.firstPlayer.height / 2;
  }
  ensureRectBounds(rect) {
    // make sure rectangles dont go ouf of bounds
    if (rect.y < 0) {
      rect.y = 0;
    }
    if (rect.y > this.game.height - rect.height) {
      rect.y = this.game.height - rect.height;
    }
  }
  update() {
    if (prevControls.start && !controls.start) {
      if (this.state === "playing") {
        this.state = "paused";
      } else {
        this.state = "playing";
      }
    }

    if (this.state !== "paused") {
      if (controls.up) {
        this.firstPlayer.moveUp();
        this.secondPlayer.moveUp();
        if (this.state === "initial") {
          this.centerBallRelativeToPlayer();
        }
      } else if (controls.down) {
        this.firstPlayer.moveDown();
        this.secondPlayer.moveDown();
        if (this.state === "initial") {
          this.centerBallRelativeToPlayer();
        }
      }

      this.ensureRectBounds(this.firstPlayer);
      this.ensureRectBounds(this.secondPlayer);

      if (this.state === "playing") {
        this.ball.move();
        // if the ball hits the upper or lower limits invert the direction
        if (
          this.ball.y + this.ball.radius >= this.game.height ||
          this.ball.y - this.ball.radius <= 0
        ) {
          this.ball.ySpeed = -this.ball.ySpeed;
        }

        // if the ball hits the rectangle increases the speed and inverts the direction
        if (
          intersects(this.ball, this.firstPlayer) ||
          intersects(this.ball, this.secondPlayer)
        ) {
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

    prevControls = Object.assign({}, controls);
  }
  secondPlayerWins() {
    this.score.rightScore += 1;
    this.initialState();
  }
  firstPlayerWins() {
    this.score.leftScore += 1;
    this.initialState();
  }
  renderPaused() {
    const topOffset = 5;
    const leftOffset = -35;
    this.game.ctx.font = "20px monospace";
    this.game.ctx.fillText(
      "Paused",
      this.game.width / 2 + leftOffset,
      this.game.height / 2 + topOffset
    );
  }
  render() {
    if (this.state === "paused") {
      this.renderPaused();
    }
    this.objs.forEach((obj) => obj.render(this.game));
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
  constructor() {
    this.leftScore = 0;
    this.rightScore = 0;
  }
  render(game) {
    const topOffset = 18;
    const y = game.height / 2 + topOffset;
    const leftOffset = -10;
    game.ctx.font = "50px monospace";
    game.ctx.fillText(this.leftScore, game.width / 4 + leftOffset, y);
    game.ctx.fillText(this.rightScore, (game.width / 4) * 3 + leftOffset, y);
  }
}

class Player {
  constructor() {
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
  render(game) {
    game.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Ball {
  constructor() {
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
  render(game) {
    game.ctx.beginPath();
    game.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    game.ctx.fillStyle = "black";
    game.ctx.fill();
  }
}
