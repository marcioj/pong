class LoopAudio {
  constructor(url) {
    this.audio = new Audio(url);
  }
  play() {
    this.audio.onended = () => {
      this.audio.play();
    };
    this.audio.play();
  }
}

const sounds = {
  background: new LoopAudio(require("./sounds/background.wav")), // https://freesound.org/people/RutgerMuller/sounds/51239/
  hit: new Audio(require("./sounds/hit.wav")), // https://freesound.org/people/NoiseCollector/packs/254/
  move: new Audio(require("./sounds/move.wav")),
};

export default sounds;
