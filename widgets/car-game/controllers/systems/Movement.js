import System from "../../../../shared/scene/ecs/core/System";
import State from "../../../../shared/scene/ecs/base/components/state/State";
import Matrix3Component from "../../../../shared/scene/ecs/base/components/transform/Matrix3Component";
import {upperFirst} from "lodash";
import {CHARACTER, DEFAULT} from "../../constants/entities/character";

export default class Movement extends System {
  updateCharacterMovement() {
    const characterEntity = this.getFirstEntityByType(CHARACTER);
    const characterStateComponent = characterEntity.get(State);
    this[`onCharacter${upperFirst(characterStateComponent.state)}`]?.(characterEntity, ...arguments);
  }

  [`onCharacter${upperFirst(DEFAULT)}`](characterEntity, {deltaTime}) {
    const {
      storage: {
        mainSceneSettings: {character},
        gameSpace: {characterMovement}
      }
    } = this;
    const characterMatrixComponent = characterEntity.get(Matrix3Component);
    const speed = (characterMovement.currentSpeed = Math.min(
      characterMovement.currentSpeed + character.velocity * deltaTime ** 2,
      character.speed * deltaTime
    ));
    const {x: multiplierX, y: multiplierY} = character.directionMultiplier[characterMovement.currentDirection];
    const deltaX = multiplierX * speed * Math.cos(character.rotationFromDirection[characterMovement.currentDirection]);
    const deltaY = multiplierY * speed * Math.sin(character.rotationFromDirection[characterMovement.currentDirection]);
    characterMatrixComponent.x = characterMatrixComponent.x + deltaX;
    characterMatrixComponent.y = characterMatrixComponent.y + deltaY;
    characterMatrixComponent.rotation = character.rotationFromDirection[characterMovement.currentDirection];
  }

  update() {
    this.updateCharacterMovement(...arguments);
  }
}
