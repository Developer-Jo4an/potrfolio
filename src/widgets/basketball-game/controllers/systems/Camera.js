import {System} from "@shared";

export class Camera extends System {
  initializationLevelSelect() {
    const {
      storage: {
        camera,
        mainSceneSettings: {
          camera: {position, fov},
        },
      },
    } = this;
    camera.position.copy(position);
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }
}
