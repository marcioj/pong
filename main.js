import Game from "./game";

const loop = (cb) => {
  requestAnimationFrame(function nextFrame() {
    cb();
    requestAnimationFrame(nextFrame);
  });
};

// const loop = (cb) => setInterval(cb, 1000);

function main() {
  const game = new Game(document.querySelector("#canvas"));
  window.game = game;

  loop(() => {
    game.nextFrame();
  });
}

window.onload = main;
