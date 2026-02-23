import {CHARACTER, DEFAULT} from "../constants/entities/character";
import {LEFT, RIGHT, System, State, Matrix3Component} from "@shared";

export class Movement extends System {
  updateCharacterMovement() {
    const eCharacter = this.getFirstEntityByType(CHARACTER);
    const cState = eCharacter.get(State);

    const functions = {
      [DEFAULT]: this.defaultMovement
    };

    functions[cState.state]?.call(this, ...arguments);
  }

  defaultMovement({deltaTime}) {
    const eCharacter = this.getFirstEntityByType(CHARACTER);
    const {
      storage: {
        mainSceneSettings: {character},
        gameSpace: {
          characterMovement,
          characterMovement: {currentSpeed, currentDirection: direction}
        }
      }
    } = this;
    // TODO: Пересмотреть с учетом физики
    const cMatrix3 = eCharacter.get(Matrix3Component);

    const speed = (characterMovement.currentSpeed = Math.min(
      currentSpeed + character.velocity * deltaTime ** 2,
      character.speed * deltaTime
    ));
    const angle = character.rotationFromDirection[direction];
    const {x: multiplierX, y: multiplierY} = character.directionMultiplier[direction];

    cMatrix3.x += multiplierX * speed * Math.cos(angle);
    cMatrix3.y += multiplierY * speed * Math.sin(angle);
    cMatrix3.rotation = {[LEFT]: -Math.PI / 2 - angle, [RIGHT]: Math.PI / 2 - angle}[direction];
  }

  update() {
    this.updateCharacterMovement(...arguments);
  }
}
