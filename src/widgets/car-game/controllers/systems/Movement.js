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
    this.updateActorAngle();
    this.updateActorPosition();
  }

  updateActorAngle() {
    const {
      cMovement: {angle},
      cMatrix,
    } = this.getActorInfo();

    cMatrix.rotation = Math.PI / 2 - angle;
  }

  updateActorPosition() {}

  onClick() {
    const {
      storage: {
        mainSceneSettings: {angle: angles},
      },
    } = this;

    const {cMovement} = this.getActorInfo();

    cMovement.angle = cMovement.angle === angles[0] ? angles[1] : angles[0];
  }

  update() {
    this.updateActorMovement(...arguments);
  }
}
