import Component from "../../../../shared/scene/ecs/core/Component";

export default class SatCollider extends Component {
  type = "satCollider";

  satObject = null;

  constructor({eventBus, satObject}) {
    super({eventBus});

    this.satObject = satObject;
  }

  destroy() {
    this.satObject = null;
    super.destroy();
  }
}
