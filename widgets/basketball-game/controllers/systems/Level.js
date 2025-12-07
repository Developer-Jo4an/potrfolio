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
    const {eventBus, storage: {scene}} = this;

    const characterEntity = new Entity({eventBus, type: CHARACTER}).init();

    const characterThreeComponent = characterEntity.get(ThreeComponent);
    const characterView = this.getAsset(characterEntity, CHARACTER);
    characterThreeComponent.threeObject = characterView;
    scene.add(characterView);

    const characterBodyComponent = characterEntity.get(Body);
    characterBodyComponent.object = this.getAsset(characterEntity, CHARACTER_BODY);
  }

  initGround() {
    const {eventBus, storage: {scene, mainSceneSettings: {ground}}} = this;

    const characterEntity = this.getFirstEntityByType(CHARACTER);

    const characterThreeComponent = characterEntity.get(ThreeComponent);
    characterThreeComponent.threeObject.geometry.computeBoundingSphere();
    const {radius: characterViewRadius} = characterThreeComponent.threeObject.geometry.boundingSphere;

    const groundEntity = new Entity({eventBus, type: GROUND}).init();

    const groundThreeComponent = groundEntity.get(ThreeComponent);
    const groundView = this.getAsset(groundEntity, GROUND);
    groundThreeComponent.threeObject = groundView;
    groundView.position.set(0, -ground.height / 2 - characterViewRadius, 0);
    scene.add(groundView);

    const groundBodyComponent = groundEntity.get(Body);
    groundBodyComponent.object = this.getAsset(groundEntity, GROUND_BODY);
  }

  update({deltaTime}) {
  }
}