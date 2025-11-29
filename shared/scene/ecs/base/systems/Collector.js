import System from "../../core/System";
import Component from "../../core/Component";
import Collection from "../components/data/Collection";

export default class Collector extends System {
  constructor(data) {
    super(data);

    this.eventBus.addEventListener(Component.EVENTS.REMOVE, this.onRemoveComponent.bind(this));
  }

  update(data) {
    super.update(data);
    this.clearEvents();
  }

  onRemoveComponent({data: {component}}) {
    if (!(component instanceof Collection && component?.group === "side-effects")) return;

    component.list.forEach(({cleanFunction}) => cleanFunction?.());
    component.list.length = 0;
  }
}
