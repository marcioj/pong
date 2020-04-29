import getControls from "./controls.js";
import { clamp } from "./utils.js";

export default class List {
  constructor(ctx, { items, onSelect, x = 0, y = 0 }) {
    this.ctx = ctx;
    this.items = items;
    this.x = x;
    this.y = y;
    this.selectedIndex = 0;
    this.controlIndex = 0;
    this.onSelect = onSelect;
    this.prevControl = this.getControl();
  }
  getControl() {
    return getControls()[this.controlIndex];
  }
  update() {
    const prevControl = this.prevControl;
    const control = this.getControl();
    if (prevControl.down && !control.down) {
      this.selectedIndex++;
      this.selectedIndex = clamp(this.selectedIndex, 0, this.items.length - 1);
    } else if (prevControl.up && !control.up) {
      this.selectedIndex--;
      this.selectedIndex = clamp(this.selectedIndex, 0, this.items.length - 1);
    } else if (prevControl.start && !control.start) {
      this.onSelect(this.items[this.selectedIndex]);
    }
    this.prevControl = control;
  }
  render() {
    const height = 30;
    const xOffset = -26;
    let itemY = height + this.y;

    this.ctx.font = `20px Gameplay`;
    this.items.forEach((item, i) => {
      const selected = this.selectedIndex === i;
      this.ctx.fillText(
        selected ? `► ${item.text}` : `${item.text}`,
        this.x + (selected ? xOffset : 0),
        itemY
      );

      itemY += height;
    });
  }
}
