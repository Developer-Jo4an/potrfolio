import {System} from "@shared";

export class Camera extends System {
  initializationLevelSelect() {
    const {
      storage: {
        camera,
        mainSceneSettings: {
          camera: {position, target},
        },
      },
    } = this;
    camera.position.copy(position);
    camera.lookAt(target.x, target.y, target.z);
  }
}
