import {Component} from "../../core/Component";

export class CollisionConfig extends Component {
  type = "collisionConfig";

  collisionConfig;

  CCDMs = 5;

  constructor({collisionConfig, CCDMs}) {
    super(...arguments);

    this.collisionConfig = collisionConfig;
    this.CCDMs = CCDMs ?? this.CCDMs;
  }

  destroy() {
    super.destroy();
    this.collisionConfig = null;
    this.CCDMs = null;
  }
}
