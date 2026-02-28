import {eventSubscription, System} from "@shared";
import {Events} from "../constants/events";

export class Movement extends System {
  constructor() {
    super(...arguments);

    this.onClick = this.onClick.bind(this);
  }

  initializationLevelSelect() {
    const {
      eventBus,
      storage: {
        serviceData: {clearFunctions},
      },
    } = this;

    const clear = eventSubscription({
      target: eventBus,
      callbacksBus: [{event: Events.CLICK, callback: this.onClick}],
    });

    clearFunctions.push(clear);
  }

  updateActorMovement() {
    this.updateActorAngle(...arguments);
    this.updateActorPosition(...arguments);
  }

  updateActorAngle() {
    const {
      cMovement: {angle},
      cMatrix,
    } = this.getActorInfo();

    cMatrix.rotation = Math.PI / 2 - angle;
  }

  updateActorPosition({deltaS}) {
    const {
      cMatrix,
      cMovement,
      cMovement: {acceleration, angle, maxSpeed, currentSpeed},
    } = this.getActorInfo();

    const distance = currentSpeed * deltaS + (acceleration * deltaS ** 2) / 2;

    const deltaX = Math.cos(angle) * distance;
    const deltaY = Math.sin(angle) * distance;

    cMatrix.x += deltaX;
    cMatrix.y -= deltaY;

    cMovement.currentSpeed = Math.min(currentSpeed + acceleration * deltaS, maxSpeed);
  }

  onClick() {
    const {
      storage: {
        mainSceneSettings: {
          angle: [left, right],
        },
      },
    } = this;

    const {cMovement} = this.getActorInfo();

    cMovement.angle = cMovement.angle === left ? right : left;
  }

  update() {
    this.updateActorMovement(...arguments);
  }
}
