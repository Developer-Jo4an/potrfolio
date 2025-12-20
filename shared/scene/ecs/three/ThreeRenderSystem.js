import System from "../core/System";
import Mixer from "./components/Mixer";
import ThreeComponent from "./components/ThreeComponent";
import Matrix4Component from "../base/components/transform/Matrix4Component";

export default class ThreeRenderSystem extends System {
  updateAnimations({deltaTime}) {
    const entities = this.filterEntitiesByClass(Mixer);
    entities.forEach(entity => entity.getList(Mixer).forEach(cMixer => cMixer.mixer?.update(deltaTime)));
  }

  getNecessaryEntities() {
    return this.filterEntitiesByClass(ThreeComponent, Matrix4Component);
  }

  updateItems() {
    const entities = this.getNecessaryEntities();
    entities.forEach(entity => this.updateItem(entity));
  }

  updateItem(entity) {
    const cThree = entity.get(ThreeComponent);
    const {threeObject} = cThree;
    const cMatrix4 = entity.get(Matrix4Component);

    if (!threeObject || !cMatrix4) return;

    if (!threeObject.matrixAutoUpdate && !threeObject.needsDisableAutoUpdate) return;

    const {position, scale, quaternion} = cMatrix4;

    threeObject.position.copy(position);
    threeObject.quaternion.copy(quaternion);
    threeObject.scale.copy(scale);

    if (threeObject.needsMakeVisible) {
      threeObject.visible = true;
      threeObject.needsMakeVisible = false;
    }

    if (threeObject.needsDisableAutoUpdate) {
      threeObject.matrixAutoUpdate = false;
      threeObject.updateMatrix();
      threeObject.needsDisableAutoUpdate = false;
    }
  }

  update() {
    this.updateAnimations(...arguments);
    this.updateItems(...arguments);
  }
}