import Game from "./game";

function main() {
  const game = new Game(document.querySelector("#canvas"));

  requestAnimationFrame(function loop() {
    game.clear();
    game.update();
    game.render();
    requestAnimationFrame(loop);
  });
}

window.onload = main;
