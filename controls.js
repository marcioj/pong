const controlMapping = {
  ArrowUp: "up",
  ArrowDown: "down",
  " ": "start",
};
const controls = {};

document.addEventListener("keydown", (evt) => {
  controls[controlMapping[evt.key]] = true;
});

document.addEventListener("keyup", (evt) => {
  controls[controlMapping[evt.key]] = false;
});

export default function getControls() {
  return Object.assign({}, controls);
}
