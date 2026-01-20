import {upperFirst} from "lodash";
import {MAIN_CONTAINER} from "../../constants/entities/mainContainer";
import {CHARACTER, DEFAULT} from "../../constants/entities/character";
import {GAME_SIZE} from "../../constants/game";
import {Matrix3Component, System} from "@shared";
import {State} from "@/shared/scene/src/ecs/base/components/state/State"; //TODO: поправить импорт

export class Camera extends System {
  updateFromCharacter() {
    const characterEntity = this.getFirstEntityByType(CHARACTER);
    const characterStateComponent = characterEntity.get(State);
    this[`onCharacter${upperFirst(characterStateComponent.state)}`]?.(characterEntity, ...arguments);
  }

  [`onCharacter${upperFirst(DEFAULT)}`](characterEntity) {
    const {
      storage: {
        mainSceneSettings: {
          camera: {trackingBoundary},
        },
      },
    } = this;
    const characterMatrix3Component = characterEntity.get(Matrix3Component);
    const mainContainerEntity = this.getFirstEntityByType(MAIN_CONTAINER);
    const mainContainerMatrix3Component = mainContainerEntity.get(Matrix3Component);

    const characterViewGlobalPosition = {
      x: mainContainerMatrix3Component.x + characterMatrix3Component.x,
      y: mainContainerMatrix3Component.y + characterMatrix3Component.y,
    };

    mainContainerMatrix3Component.y += Math.max(0, trackingBoundary - characterViewGlobalPosition.y);
    mainContainerMatrix3Component.x = GAME_SIZE.width / 2 - characterMatrix3Component.x;
  }

  update() {
    this.updateFromCharacter(...arguments);
  }

  reset() {}
}
