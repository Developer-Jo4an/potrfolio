import System from "../../../../shared/scene/ecs/core/System";
import State from "../../../../shared/scene/ecs/base/components/state/State";
import Matrix3Component from "../../../../shared/scene/ecs/base/components/transform/Matrix3Component";
import {upperFirst} from "lodash";
import {MAIN_CONTAINER} from "../../constants/entities/mainContainer";
import {CHARACTER, DEFAULT} from "../../constants/entities/character";

export default class Camera extends System {
  updateFromCharacter() {
    const characterEntity = this.getFirstEntityByType(CHARACTER);
    const characterStateComponent = characterEntity.get(State);
    this[`onCharacter${upperFirst(characterStateComponent.state)}`]?.(characterEntity, ...arguments);
  }

  [`onCharacter${upperFirst(DEFAULT)}`](characterEntity) {
    const {storage: {mainSceneSettings: {camera: {trackingBoundary}}}} = this;
    const characterMatrix3Component = characterEntity.get(Matrix3Component);
    const mainContainerEntity = this.getFirstEntityByType(MAIN_CONTAINER);
    const mainContainerMatrix3Component = mainContainerEntity.get(Matrix3Component);

    const characterViewGlobalPosition = {
      x: mainContainerMatrix3Component.x + characterMatrix3Component.x,
      y: mainContainerMatrix3Component.y + characterMatrix3Component.y,
    };

    mainContainerMatrix3Component.y += Math.max(0, trackingBoundary - characterViewGlobalPosition.y);
  }

  update() {
    this.updateFromCharacter(...arguments);
  }

  reset() {

  }
}
