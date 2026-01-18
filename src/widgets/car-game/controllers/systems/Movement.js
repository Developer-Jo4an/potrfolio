import System from "../../../../shared/scene/ecs/core/System";
import State from "../../../../shared/scene/ecs/base/components/state/State";
import Matrix3Component from "../../../../shared/scene/ecs/base/components/transform/Matrix3Component";
import {upperFirst} from "lodash";
import {CHARACTER, DEFAULT} from "../../constants/entities/character";
import {LEFT, RIGHT} from "../../../../shared/constants/directions/directions";

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
        gameSpace: {characterMovement, characterMovement: {currentSpeed, currentDirection: direction}}
      }
    } = this;
    const characterMatrixComponent = characterEntity.get(Matrix3Component);
    const speed = (characterMovement.currentSpeed = Math.min(
      currentSpeed + character.velocity * deltaTime ** 2, // т.к ускорение
      character.speed * deltaTime
    ));
    const angle = character.rotationFromDirection[direction];

    const {x: multiplierX, y: multiplierY} = character.directionMultiplier[direction];
    const deltaX = multiplierX * speed * Math.cos(angle);
    const deltaY = multiplierY * speed * Math.sin(angle);
    characterMatrixComponent.x += deltaX;
    characterMatrixComponent.y += deltaY;

    characterMatrixComponent.rotation = {[LEFT]: -Math.PI / 2 - angle, [RIGHT]: Math.PI / 2 - angle}[direction];
  }

  update() {
    this.updateCharacterMovement(...arguments);
  }
}
