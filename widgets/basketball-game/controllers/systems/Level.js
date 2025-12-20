import System from "../../../../shared/scene/ecs/core/System";
import Entity from "../../../../shared/scene/ecs/core/Entity";
import ThreeComponent from "../../../../shared/scene/ecs/three/components/ThreeComponent";
import Body from "../../../../shared/scene/ecs/rapier/components/Body";
import {CHARACTER, CHARACTER_BODY} from "../../entities/character";
import {GROUND, GROUND_BODY} from "../../entities/ground";

export default class Level extends System {
  initializationLevelSelect() {
    this.initCharacter();
    this.initGround();
  }

  initCharacter() {
    const {
      eventBus, storage: {
        scene,
        mainSceneSettings: {
          character: {
            receiveShadow,
            castShadow,
            metalness,
            roughness,
            startData: {rotation, position}
          }
        }
      }
    } = this;

    const eCharacter = new Entity({eventBus, type: CHARACTER}).init();

    const cThreeComponent = eCharacter.get(ThreeComponent);
    const characterView = this.getAsset(eCharacter, CHARACTER);
    characterView.material.metalness = metalness;
    characterView.material.roughness = roughness;
    characterView.receiveShadow = receiveShadow;
    characterView.castShadow = castShadow;
    cThreeComponent.threeObject = characterView;
    scene.add(characterView);

    const cBodyComponent = eCharacter.get(Body);
    const vertices = Array.from(characterView.geometry.attributes.position.array);
    const indexes = Array.from(characterView.geometry.index.array);
    const characterBody = cBodyComponent.object = this.getAsset(eCharacter, CHARACTER_BODY, {
      vertices,
      indexes
    });
    characterBody.setTranslation(position);
    characterBody.setRotation(new THREE.Quaternion().setFromEuler(new THREE.Euler(rotation.x, rotation.y, rotation.z)));
    characterBody.setBodyType(RAPIER3D.RigidBodyType.Fixed);
  }

  initGround() {
    const {eventBus, storage: {scene, mainSceneSettings: {ground: {height, castShadow, receiveShadow}}}} = this;

    const eGroud = new Entity({eventBus, type: GROUND}).init();

    const cThreeComponent = eGroud.get(ThreeComponent);
    const groundView = this.getAsset(eGroud, GROUND);
    groundView.name = GROUND;
    groundView.receiveShadow = receiveShadow;
    groundView.castShadow = castShadow;
    cThreeComponent.threeObject = groundView;
    scene.add(groundView);

    const eCharacter = this.getFirstEntityByType(CHARACTER);
    const cBodyComponent = eGroud.get(Body);
    const cCharacterThreeComponent = eCharacter.get(ThreeComponent);
    cCharacterThreeComponent.threeObject.geometry.computeBoundingSphere();
    const characterViewRadius = cCharacterThreeComponent.threeObject.geometry.boundingSphere.radius;
    const vertices = Array.from(groundView.geometry.attributes.position.array);
    const indexes = Array.from(groundView.geometry.index.array);
    const groundBody = cBodyComponent.object = this.getAsset(eGroud, GROUND_BODY, {vertices, indexes});
    groundBody.setTranslation({x: 0, y: -height / 2 - characterViewRadius, z: 0});
  }

  update({deltaTime}) {
  }
}