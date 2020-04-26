const controlMappings = [
  {
    w: "up",
    s: "down",
    " ": "start",
  },
  {
    ArrowUp: "up",
    ArrowDown: "down",
    Enter: "start",
  },
];
const controls = [{}, {}];

document.addEventListener("keydown", (evt) => {
  controls.forEach((control, i) => {
    control[controlMappings[i][evt.key]] = true;
  });
});

document.addEventListener("keyup", (evt) => {
  controls.forEach((control, i) => {
    control[controlMappings[i][evt.key]] = false;
  });
});

function getGamePadControl(index) {
  const gamepad = navigator.getGamepads()[index];
  if (gamepad) {
    const axes = gamepad.axes;
    return {
      start: gamepad.buttons[4].pressed,
      up: axes[0] > 0.2,
      down: axes[1] > 0.2,
    };
  }
}

function getKeyBoardControl(index) {
  return Object.assign({}, controls[index]);
}

export default function getControls() {
  return [
    getGamePadControl(0) || getKeyBoardControl(0),
    getGamePadControl(1) || getKeyBoardControl(1),
  ];
}
