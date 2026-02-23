import {MAIN_CONTAINER} from "../constants/entities/mainContainer";
import {CHARACTER, DEFAULT} from "../constants/entities/character";
import {GAME_SIZE} from "../constants/game";
import {Matrix3Component, State, System} from "@shared";

export class Camera extends System {
  updateCamera() {
    const characterEntity = this.getFirstEntityByType(CHARACTER);
    const characterStateComponent = characterEntity.get(State);

    const functions = {
      [DEFAULT]: this.defaultMovement
    };

    functions[characterStateComponent.state]?.call(this, ...arguments);
  }

  defaultMovement() {
    const characterEntity = this.getFirstEntityByType(CHARACTER);
    const {
      storage: {
        mainSceneSettings: {
          camera: {trackingBoundary}
        }
      }
    } = this;

    const cMatrix3Character = characterEntity.get(Matrix3Component);
    const eMainContainer = this.getFirstEntityByType(MAIN_CONTAINER);
    const cMatrix3MainContainer = eMainContainer.get(Matrix3Component);

    const characterViewGlobalPosition = {
      x: cMatrix3MainContainer.x + cMatrix3Character.x,
      y: cMatrix3MainContainer.y + cMatrix3Character.y
    };

    cMatrix3MainContainer.y += Math.max(0, trackingBoundary - characterViewGlobalPosition.y);
    cMatrix3MainContainer.x = GAME_SIZE.width / 2 - cMatrix3Character.x;
  }

  update() {
    this.updateCamera(...arguments);
  }

  reset() {
  }
}
