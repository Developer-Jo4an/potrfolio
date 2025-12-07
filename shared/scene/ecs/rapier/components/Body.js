import Component from "../../core/Component";

export default class Body extends Component {
  type = "body";

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
