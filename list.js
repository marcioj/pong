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
    this.prevControls = getControls()[this.controlIndex];
  }
  update() {
    const prevControls = this.prevControls;
    const controls = getControls()[this.controlIndex];
    if (prevControls.down && !controls.down) {
      this.selectedIndex++;
      this.selectedIndex = clamp(this.selectedIndex, 0, this.items.length - 1);
    } else if (prevControls.up && !controls.up) {
      this.selectedIndex--;
      this.selectedIndex = clamp(this.selectedIndex, 0, this.items.length - 1);
    } else if (prevControls.start && !controls.start) {
      this.onSelect(this.items[this.selectedIndex]);
    }
    this.prevControls = controls;
  }
  render() {
    const height = 20;
    let itemY = height + this.y;

    this.ctx.font = `${height}px monospace`;
    this.items.forEach((item, i) => {
      const selected = this.selectedIndex === i;
      this.ctx.fillText(
        selected ? `► ${item.text}` : `  ${item.text}`,
        this.x,
        itemY
      );

      itemY += height;
    });
  }
}
