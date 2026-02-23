import {System} from "../../core/System";
import {SatCollider} from "../components/SatCollider";
import {getPointsFromPolygon} from "../utils/vertices";
import {Matrix3Component} from "../../base/components/transform/Matrix3Component";

/**
 * @warning - тестировал только для SAT.Polygon
 */

class SatDebugSystem extends System {
  updateItems() {
    const entities = this.filterEntitiesByClass(SatCollider);

    entities.forEach(entity => {
      const cSatCollider = entity.get(SatCollider, Matrix3Component);

      const {collider} = cSatCollider;

      if (!collider) return;

      const globalVertices = this.getGlobalVertices(collider);

      this.paint(entity, globalVertices);
    });
  }

  getGlobalVertices(polygon) {
    return getPointsFromPolygon(polygon);
  }

  paint(entity, globalVertices) {
  }

  update() {
    super.update(...arguments);
    this.updateItems(...arguments);
  }
}

export {SatDebugSystem};
