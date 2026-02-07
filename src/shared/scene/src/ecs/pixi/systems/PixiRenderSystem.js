import {System} from "../../core/System";
import {PixiComponent} from "../components/PixiComponent";
import {Matrix3Component} from "../../base/components/transform/Matrix3Component";
import {eventSubscription} from "../../../../../lib/src/events/eventListener";

export class PixiRenderSystem extends System {
  serviceData = {
    clearFunctions: []
  };

  constructor() {
    super(...arguments);

    this.update = this.update.bind(this);
  }

  prepareSelect() {
    this.initEvents();
  }

  initEvents() {
    const {
      eventBus,
      serviceData: {clearFunctions}
    } = this;

    const clear = eventSubscription({
      target: eventBus,
      callbacksBus: [{event: "pixi-render-system:force-update", callback: this.update}]
    });

    clearFunctions.push(clear);
  }

  updateItems() {
    const entities = this.filterEntitiesByClass(PixiComponent, Matrix3Component);

    entities.forEach(entity => {
      const pixiComponent = entity.get(PixiComponent);
      const matrix3Component = entity.get(Matrix3Component);

      if (!pixiComponent.pixiObject) return;

      pixiComponent.pixiObject.position.set(matrix3Component.x, matrix3Component.y);
      pixiComponent.pixiObject.scale.set(matrix3Component.scaleX, matrix3Component.scaleY);
      pixiComponent.pixiObject.rotation = matrix3Component.rotation;
      pixiComponent.pixiObject.skew.set(matrix3Component.skewX, matrix3Component.skewY);
      pixiComponent.pixiObject.pivot.set(matrix3Component.pivotX, matrix3Component.pivotY);
    });
  }

  update() {
    super.update(...arguments);
    this.updateItems(...arguments);
  }

  reset() {
    const {
      serviceData: {clearFunctions}
    } = this;

    clearFunctions.forEach(clear => clear());
    clearFunctions.length = 0;

    super.reset();
  }
}
