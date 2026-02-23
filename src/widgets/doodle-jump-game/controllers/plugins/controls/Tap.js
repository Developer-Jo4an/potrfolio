import {Controls} from "./Controls";
import {Physics} from "../../components/Physics";

export class Tap extends Controls {
  /**
   * x
   */
  updateX() {
    const {system} = this;

    const {
      cPhysics: {movementType},
    } = system.getCharacterInfo();

    const movementHandlers = {
      [Physics.MovementTypes.linear]: this.updateLinearX,
      [Physics.MovementTypes.accelerated]: this.updateAcceleratedX,
    };

    movementHandlers[movementType]?.call(this, ...arguments);

    super.updateX(...arguments);
  }

  updateLinearX({deltaS}) {
    const {system} = this;
    const {
      settings: {
        speed: {
          tap: {forLinearMovement},
        },
      },
      cInput,
      cMatrix,
      cPhysics,
    } = system.getCharacterInfo();

    if (cInput.right === cInput.left) return;

    cPhysics.speedX = cInput.right ? forLinearMovement : -forLinearMovement;
    cMatrix.x = cMatrix.x + cPhysics.speedX * deltaS;
  }

  updateAcceleratedX({deltaS}) {
    const {system} = this;
    const {
      settings: {
        speed: {
          tap: {forAcceleratedMovement, speedEPS},
        },
      },
      cInput,
      cMatrix,
      cPhysics,
    } = system.getCharacterInfo();

    let targetXSpeed = 0;
    if (cInput.left !== cInput.right) targetXSpeed = cInput.right ? forAcceleratedMovement : -forAcceleratedMovement;

    let newXSpeed;
    if (Math.abs(cPhysics.speedX - targetXSpeed) <= speedEPS) {
      newXSpeed = targetXSpeed;
    } else if (cPhysics.speedX > targetXSpeed) {
      newXSpeed = Math.max(targetXSpeed, -cPhysics.accelerationX * deltaS + cPhysics.speedX);
    } else {
      newXSpeed = Math.min(targetXSpeed, cPhysics.accelerationX * deltaS + cPhysics.speedX);
    }

    cMatrix.x += newXSpeed * deltaS;
    cPhysics.speedX = newXSpeed;
  }
}
