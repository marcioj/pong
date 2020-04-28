import PongScreen from "./pong_screen.js";
import List from "./list.js";

export default class PlayerSelectionScreen {
  constructor(game) {
    this.game = game;
    this.selectionList = new List(this.game.ctx, {
      items: [
        { id: "1p_1p", text: "1P vs 1P" },
        { id: "1p_com", text: "1P vs COM" },
        { id: "multiplayer", text: "1P vs 2P" },
      ],
      onSelect: (item) => {
        this.game.settings.playMode = item.id;
        this.game.changeScreen(PongScreen);
      },
    });
  }
  update() {
    const xOffset = 130;
    const yOffset = 150;
    this.selectionList.x = this.game.width / 4 + xOffset;
    this.selectionList.y = this.game.height / 4 + yOffset;
    this.selectionList.update();
  }
  render() {
    const xOffset = -30;
    const yOffset = 200;
    this.game.ctx.font = "100px Gameplay";
    this.game.ctx.fillText("PONG", this.game.width / 3 + xOffset, yOffset);
    this.selectionList.render();
  }
}
