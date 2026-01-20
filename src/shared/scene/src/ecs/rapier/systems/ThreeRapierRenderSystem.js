import {ThreeRenderSystem} from "../../three/systems/ThreeRenderSystem";
import {Body} from "../components/Body";
import {Matrix4Component} from "../../base/components/transform/Matrix4Component";

export class ThreeRapierRenderSystem extends ThreeRenderSystem {
  updateItems() {
    const items = this.getNecessaryEntities();

    items.forEach((entity) => {
      const cBody = entity.get(Body);
      cBody ? this.updatePhysicalItem(entity) : this.updateItem(entity);
    });
  }

  updatePhysicalItem(entity) {
    const cBody = entity.get(Body);
    const cMatrix4 = entity.get(Matrix4Component);

    // TODO: придумать что-то для scale
    const translation = cBody.object.translation();
    const quaternion = cBody.object.rotation();

    cMatrix4.position = translation;
    cMatrix4.quaternion = quaternion;

    this.updateItem(entity);
  }

  update() {
    this.updateItems();
    this.updateAnimations(...arguments);
  }
}
