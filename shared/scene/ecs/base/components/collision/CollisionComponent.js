import Component from "../../../core/Component";

export default class CollisionComponent extends Component {
  type = "collisionComponent";

  constructor({eventBus, collision = {}}) {
    super({eventBus});
    const {collisionGroup, collisionList} = collision;
    this.collisionGroup = collisionGroup ?? "group";
    this.collisionList = collisionList ?? [];
  }
}
