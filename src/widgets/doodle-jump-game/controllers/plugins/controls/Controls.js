import {GAME_SIZE} from "../../constants/game";
import {Boosters} from "../../entities/booster";
import {Plugin} from "../Plugin";

export class Controls extends Plugin {
  /**
   * x
   */
  updateX() {
    this.checkTeleport(...arguments);
    this.lookAt(...arguments);
  }

  checkTeleport({ticks}) {
    const {system} = this;
    const {
      view,
      cMatrix,
      cMatrix: {x, y},
    } = system.getCharacterInfo();

    const positionFromStage = system.getPositionFromStage(view, {x, y}, ticks !== 1);

    if (positionFromStage.x > GAME_SIZE.width) {
      cMatrix.x = positionFromStage.x - GAME_SIZE.width;
    } else if (positionFromStage.x < 0) {
      cMatrix.x = GAME_SIZE.width - Math.abs(positionFromStage.x);
    }
  }

  lookAt() {
    const {system} = this;
    const {cInput, cMatrix} = system.getCharacterInfo();

    if (cInput.right === cInput.left) return;

    const multiplier = cInput.right ? -1 : 1;
    cMatrix.scaleX = Math.abs(cMatrix.scaleX) * multiplier;
  }

  /**
   * y
   */
  updateY() {
    const {system} = this;
    const {cBooster} = system.getCharacterInfo();

    const necessaryFunction = {
      [Boosters.PROPELLER]: this.updateYByPropeller,
      [Boosters.JETPACK]: this.updateYByPropeller,
    }[cBooster.group];

    (necessaryFunction ?? this.updateDefaultY).call(this, ...arguments);
  }

  updateDefaultY({deltaS, isJumped}) {
    const {system} = this;
    const {cPhysics, cMatrix} = system.getCharacterInfo();
    const scaledJumpForce = system.calculateJumpForce();

    if (isJumped) cPhysics.speedY = scaledJumpForce;

    const {accelerationY, speedY} = cPhysics;
    const {y} = cMatrix;

    const newY = y + speedY * deltaS + (accelerationY * deltaS ** 2) / 2;
    const newSpeedY = accelerationY * deltaS + speedY;

    cMatrix.y = newY;
    cPhysics.speedY = newSpeedY;
  }

  updateYByPropeller({deltaS}) {
    const {system} = this;
    const {
      cBooster: {data: boosterData},
      cPhysics,
      cMatrix,
    } = system.getCharacterInfo();

    const {maxSpeed, acceleration} = boosterData;

    const {speedY} = cPhysics;
    const {y} = cMatrix;

    const newY = y + speedY * deltaS + (acceleration * deltaS ** 2) / 2;
    const newSpeedY = Math.max(acceleration * deltaS + cPhysics.speedY, maxSpeed);

    cMatrix.y = newY;
    cPhysics.speedY = newSpeedY;
  }
}
