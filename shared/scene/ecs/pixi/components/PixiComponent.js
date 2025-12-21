import Component from "../../core/Component";

export default class PixiComponent extends Component {
  pixiObject;

  constructor({pixiObject}) {
    super(...arguments);

    this.pixiObject = pixiObject;
  }

  destroy() {
    super.destroy();
    this.pixiObject = null;
  }
}
