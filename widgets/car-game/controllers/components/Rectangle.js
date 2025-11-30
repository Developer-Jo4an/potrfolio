import Component from "../../../../shared/scene/ecs/core/Component";

export default class Rectangle extends Component {
  rectangle;

  constructor({eventBus, rectangle}) {
    super({eventBus});
    this.rectangle = rectangle;
  }

  destroy() {
    this.rectangle = null;
    super.destroy();
  }
}