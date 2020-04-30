import Game from "./game.js";

const loop = (cb) => {
  requestAnimationFrame(function nextFrame() {
    cb();
    requestAnimationFrame(nextFrame);
  });
};

async function main() {
  // Wait for the font to load to avoid FOUC
  await document.fonts.load('16px "Gameplay"');
  const game = new Game(document.querySelector("#canvas"));
  window.game = game;

  loop(() => {
    game.nextFrame();
  });
}

window.onload = main;
