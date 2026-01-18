import System from "../../../../shared/scene/ecs/core/System";

export default class Camera extends System {
  initializationLevelSelect() {
    const {storage: {camera, mainSceneSettings: {camera: {position, target}}}} = this;
    camera.position.copy(position);
    camera.lookAt(target.x, target.y, target.z);
  }
}