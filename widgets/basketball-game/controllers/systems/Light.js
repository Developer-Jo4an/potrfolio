import System from "../../../../shared/scene/ecs/core/System";

export default class Light extends System {
  initializationLevelSelect() {
    const {
      storage: {
        scene,
        mainSceneSettings: {lights: {ambient: ambientSettings, directional: directionalSettings}}
      }
    } = this;

    const ambient = new THREE.AmbientLight(ambientSettings.color, ambientSettings.intensity);
    scene.add(ambient);

    const directional = new THREE.DirectionalLight(directionalSettings.color, directionalSettings.intensity);
    directional.position.copy(directionalSettings.position);
    directional.castShadow = directionalSettings.castShadow;
    const target = directional.target = new THREE.Object3D();
    target.position.copy(directionalSettings.target.position);
    const {camera: directionalCamera, mapSize} = directional.shadow;
    directionalCamera.left = directionalSettings.rectangle.left;
    directionalCamera.right = directionalSettings.rectangle.right;
    directionalCamera.top = directionalSettings.rectangle.top;
    directionalCamera.bottom = directionalSettings.rectangle.bottom;
    mapSize.width = directionalSettings.rectangle.width;
    mapSize.height = directionalSettings.rectangle.height;
    scene.add(directional);
    scene.add(target);
  }
}

