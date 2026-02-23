import {Component} from "../../core/Component";

class PixiDebugComponent extends Component {
  type = "pixiDebugComponent";

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

export {PixiDebugComponent};
