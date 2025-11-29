import Component from "../../core/Component";

export default class PixiComponent extends Component {
  type = "pixiComponent";

  constructor({eventBus, pixiObject}) {
    super({eventBus});

    this.pixiObject = pixiObject;
    this.onChange();
  }
}
