import BaseController from "../BaseController/BaseController";
import {COLLISION_START} from "../../../constants/events";
import global from "../../../../../shared/constants/global/global";

export default class CollisionObserver extends BaseController {
  constructor(data) {
    super(data);

    this.init();
  }

  init() {
    const {engine, eventBus} = this;

    global.Matter.Events.on(engine, COLLISION_START, e => {
      const {pairs} = e;

      pairs.forEach(({bodyA, bodyB}) => {
        const {label: labelA} = bodyA;
        const {label: labelB} = bodyB;
        eventBus.dispatchEvent({type: `${labelA}:collision`, collisionBody: bodyA});
        eventBus.dispatchEvent({type: `${labelB}:collision`, collisionBody: bodyB});
      });
    });
  }
}