import System from "../../../../shared/scene/ecs/core/System";
import Entity from "../../../../shared/scene/ecs/core/Entity";
import ThreeComponent from "../../../../shared/scene/ecs/three/components/ThreeComponent";
import {CHARACTER} from "../../entities/character";
import {GROUND} from "../../entities/ground";
import global from "../../../../shared/constants/global/global";

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
  }

  initGround() {
    const {eventBus, storage: {scene}} = this;

    const characterEntity = this.getFirstEntityByType(CHARACTER);
    const characterThreeComponent = characterEntity.get(ThreeComponent);
    characterThreeComponent.threeObject.geometry.computeBoundingSphere();
    const {radius: characterViewRadius} = characterThreeComponent.threeObject.geometry.boundingSphere;
    const groundEntity = new Entity({eventBus, type: GROUND}).init();
    const groundThreeComponent = groundEntity.get(ThreeComponent);
    const groundView = this.getAsset(groundEntity, GROUND);
    groundThreeComponent.threeObject = groundView;
    groundView.position.set(0, -characterViewRadius, 0);
    scene.add(groundView);
  }

  update({deltaTime}) {
  }
}