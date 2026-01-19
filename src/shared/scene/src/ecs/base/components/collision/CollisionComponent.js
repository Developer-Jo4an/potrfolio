import {Component} from "../../../core/Component";

export class CollisionComponent extends Component {
  collisionList;

  constructor({collision = {}}) {
    super(...arguments);
    this.collisionList = collision?.collisionList ?? [];
  }

  destroy() {
    super.destroy();
    this.collisionList = null;
  }
}
