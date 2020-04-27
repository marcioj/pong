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
  background: new LoopAudio("./sounds/background.wav"), // https://freesound.org/people/RutgerMuller/sounds/51239/
  hit: new Audio("./sounds/hit.wav"), // https://freesound.org/people/NoiseCollector/packs/254/
  move: new Audio("./sounds/move.wav"),
};

export default sounds;
