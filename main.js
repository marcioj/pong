function intersects(circle, rect) {
  let left = rect.x + rect.width > circle.x - circle.radius;
  let right = rect.x < circle.x + circle.radius;
  let top = rect.y < circle.y + circle.radius;
  let bottom = rect.y + rect.height > circle.y - circle.radius;
  return left && right && bottom && top;
}

class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.state = "initial";
    this.leftRect = null;
    this.rightRect = null;
    this.ball = null;
    this.score = null;
  }
  get width() {
    return this.ctx.canvas.width;
  }
  get height() {
    return this.ctx.canvas.height;
  }
  get objs() {
    return [this.leftRect, this.rightRect, this.ball, this.score];
  }
  initialState() {
    this.state = "initial";
    this.leftRect.x = 0;
    this.leftRect.y = this.height / 2 - this.leftRect.height / 2; // center horizontally
    this.rightRect.x = this.width - this.rightRect.width;
    this.rightRect.y = this.height / 2 - this.rightRect.height / 2; // center horizontally
    this.ball.x = this.ball.radius + this.leftRect.width;
    this.ball.resetSpeed();
    this.centerBallRelativeToRect();
  }
  centerBallRelativeToRect() {
    this.ball.y = this.leftRect.y + this.leftRect.height / 2;
  }
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
  update() {
    this.objs.forEach((obj) => obj.update(this));
    // if the ball hits the rectangle increases the speed and inverts the direction
    if (
      intersects(this.ball, this.leftRect) ||
      intersects(this.ball, this.rightRect)
    ) {
      this.ball.increaseSpeed();
      this.ball.xSpeed = -this.ball.xSpeed;
    } else {
      // if it touches the left or right border, someone scored one point
      if (this.ball.x <= this.ball.radius) {
        this.rightWins();
      } else if (this.ball.x + this.ball.radius >= this.width) {
        this.leftWins();
      }
    }
  }
  rightWins() {
    this.score.rightScore += 1;
    this.initialState();
  }
  leftWins() {
    this.score.leftScore += 1;
    this.initialState();
  }
  render() {
    this.objs.forEach((obj) => obj.render(this));
  }
}

class Score {
  constructor() {
    this.leftScore = 0;
    this.rightScore = 0;
  }
  update(game) {}
  render(game) {
    const topOffset = 18;
    const y = game.height / 2 + topOffset;
    const leftOffset = -10;
    game.ctx.font = "50px monospace";
    game.ctx.fillText(this.leftScore, game.width / 4 + leftOffset, y);
    game.ctx.fillText(this.rightScore, (game.width / 4) * 3 + leftOffset, y);
  }
}

class Rectangle {
  constructor() {
    this.width = 30;
    this.height = 100;
    this.x = 0;
    this.y = 0;
    this.moveBy = 20;
  }
  moveUp() {
    this.y -= this.moveBy;
  }
  moveDown() {
    this.y += this.moveBy;
  }
  update(game) {
    // make sure rectangles dont go ouf of bounds
    if (this.y < 0) {
      this.y = 0;
    }
    if (this.y > game.height - this.height) {
      this.y = game.height - this.height;
    }
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
    this.speed = 4;
    this.resetSpeed();
  }
  resetSpeed() {
    this.xSpeed = this.speed;
    this.ySpeed = this.speed;
  }
  increaseSpeed() {
    this.xSpeed *= 1.1;
    this.ySpeed *= 1.1;
  }
  update(game) {
    if (game.state !== "playing") return;
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    if (this.y + this.radius >= game.height || this.y - this.radius <= 0) {
      this.ySpeed = -this.ySpeed;
    }
  }
  render(game) {
    game.ctx.beginPath();
    game.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    game.ctx.fillStyle = "black";
    game.ctx.fill();
  }
}

function main() {
  const canvas = document.querySelector("#canvas");
  canvas.style.border = "1px solid black";
  const ctx = canvas.getContext("2d");
  const game = new Game(ctx);
  game.leftRect = new Rectangle();
  game.rightRect = new Rectangle();
  game.ball = new Ball();
  game.score = new Score();
  game.initialState();
  window.game = game;

  window.onkeydown = (evt) => {
    if (evt.key === " ") {
      if (game.state === "paused") {
        game.state = "playing";
      } else {
        game.state = "paused";
      }
    }
    if (game.state === "paused") return;

    console.log("keydown");
    if (evt.key === "ArrowUp") {
      game.leftRect.moveUp();
      game.rightRect.moveUp();
      if (game.state === "initial") {
        game.update(); // TODO: Workaround to not make the ball go out of bounds
        game.centerBallRelativeToRect();
      }
    }
    if (evt.key === "ArrowDown") {
      game.leftRect.moveDown();
      game.rightRect.moveDown();
      if (game.state === "initial") {
        game.update(); // TODO: Workaround to not make the ball go out of bounds
        game.centerBallRelativeToRect();
      }
    }
  };

  requestAnimationFrame(function loop() {
    game.clear();
    game.update();
    game.render();
    requestAnimationFrame(loop);
  });
}

window.onload = main;
