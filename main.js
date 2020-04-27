import Game from "./game.js";

const loop = (cb) => {
  requestAnimationFrame(function nextFrame() {
    cb();
    requestAnimationFrame(nextFrame);
  });
};

function main() {
  const game = new Game(document.querySelector("#canvas"));
  window.game = game;

  loop(() => {
    game.nextFrame();
  });
}

window.onload = main;
