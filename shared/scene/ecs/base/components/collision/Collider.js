import Component from "../../../core/Component";

export default class Collider extends Component {
  type = "collider";

  object = null;

  constructor({eventBus, object}) {
    super({eventBus});

    this.object = object;
  }

  destroy() {
    this.object = null;
    super.destroy();
  }
}
