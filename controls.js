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

export default function getControls() {
  return controls.map((control) => Object.assign({}, control));
}
