import System from "../../../../shared/scene/ecs/core/System";
import global from "../../../../shared/constants/global/global";

export default class Camera extends System {
  initializationLevelSelect() {
    const {storage: {camera, canvas, mainSceneSettings: {camera: {position, target}}}} = this;
    camera.position.copy(position);
    camera.lookAt(target.x, target.y, target.z);
    // const controls = this.controls = new global.THREE.OrbitControls(camera, canvas);
  }

  update() {
    // this.controls.update();
  }
}