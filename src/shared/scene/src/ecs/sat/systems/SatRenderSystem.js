import {System} from "../../core/System";
import {SatCollider} from "../components/SatCollider";
import {Matrix3Component} from "../../base/components/transform/Matrix3Component";

/**
 * @warning - Подходил только для SAT.Polygon
 */

class SatRenderSystem extends System {
  constructor() {
    super(...arguments);

    this.update = this.update.bind(this);
  }

  updateItems() {
    const entities = this.filterEntitiesByClass(SatCollider, Matrix3Component);

    entities.forEach(entity => {
      const matrix3Component = entity.get(Matrix3Component);
      const cSatCollider = entity.get(SatCollider);

      const {collider} = cSatCollider;

      if (!collider) return;

      cSatCollider.x = matrix3Component.x;
      cSatCollider.y = matrix3Component.y;
      cSatCollider.angle = matrix3Component.rotation;
    });
  }

  update() {
    super.update(...arguments);
    this.updateItems(...arguments);
  }
}

export {SatRenderSystem};
