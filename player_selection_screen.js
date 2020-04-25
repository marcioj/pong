import PongScreen from "./pong_screen";
import List from "./list";

export default class PlayerSelectionScreen {
  constructor(game) {
    this.game = game;
    this.selectionList = new List(this.game.ctx, {
      items: [
        { id: "1p_1p", text: "1P vs 1P" },
        { id: "1p_com", text: "1P vs COM" },
        { id: "1p_2p_local", text: "1P vs 2P Local" },
        { id: "1p_2p_online", text: "1P vs 2P Online" },
      ],
      onSelect: (item) => {
        this.game.settings.playMode = item.id;
        this.game.changeScreen(PongScreen);
      },
    });
  }
  update() {
    const xOffset = 70;
    const yOffset = 100;
    this.selectionList.x = this.game.width / 4 + xOffset;
    this.selectionList.y = this.game.height / 4 + yOffset;
    this.selectionList.update();
  }
  render() {
    this.game.ctx.font = "100px monospace";
    this.game.ctx.fillText("PONG", this.game.width / 3, 100);
    this.selectionList.render();
  }
}
