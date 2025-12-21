import System from "../../core/System";
 import PixiComponent from "../components/PixiComponent";
import Matrix3Component from "../../base/components/transform/Matrix3Component";

export default class PixiRenderSystem extends System {
  updateItems() {
    const entities = this.filterEntitiesByClass(PixiComponent, Matrix3Component);

    entities.forEach(entity => {
      const pixiComponent = entity.get(PixiComponent);
      const matrix3Component = entity.get(Matrix3Component);

      if (!pixiComponent.pixiObject) return;

      pixiComponent.pixiObject.x = matrix3Component.x;
      pixiComponent.pixiObject.y = matrix3Component.y;
      pixiComponent.pixiObject.rotation = matrix3Component.rotation;
      pixiComponent.pixiObject.scale.x = matrix3Component.scaleX;
      pixiComponent.pixiObject.scale.y = matrix3Component.scaleY;
      pixiComponent.pixiObject.skew.x = matrix3Component.skewX;
      pixiComponent.pixiObject.skew.y = matrix3Component.skewY;
    });
  }

  update() {
    super.update(...arguments);
    this.updateItems(...arguments);
  }
}
