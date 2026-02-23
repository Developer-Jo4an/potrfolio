import {Controls} from "./Controls";
import {clamp} from "lodash";

export class Gyroscope extends Controls {
  /**
   * x
   */
  updateX({deltaS}) {
    const {system} = this;

    const {
      settings: {
        speed: {
          gyroscope: {max},
        },
      },
      cMatrix,
      cPhysics: {speedX},
    } = system.getCharacterInfo();

    const maxSpeed = deltaS * max;

    cMatrix.x += clamp(speedX * deltaS, -maxSpeed, maxSpeed);

    super.updateX(...arguments);
  }
}
