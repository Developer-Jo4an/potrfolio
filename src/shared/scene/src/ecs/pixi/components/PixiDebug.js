import {Component} from "../../core/Component";

class PixiDebug extends Component {
  type = "pixiDebug";

  graphics;

  strokeSettings;

  constructor({graphics, strokeSettings}) {
    super(...arguments);
    this.graphics = graphics;
    this.strokeSettings = strokeSettings;
  }

  destroy() {
    super.destroy();
    this.graphics = null;
    this.strokeSettings = null;
  }
}

export {PixiDebug};
