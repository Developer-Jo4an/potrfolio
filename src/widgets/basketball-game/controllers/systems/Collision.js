import {EventComponent, Body, System} from "@shared";
import {COLLISION_END, COLLISION_START} from "../../constants/events";

export class Collision extends System {
  constructor() {
    super(...arguments);

    this.onCollision = this.onCollision.bind(this);
  }

  onCollision(colliderId1, colliderId2, isStarted) {
    const {eventBus} = this;
    const [data1, data2] = this.getDataByCollisionId(colliderId1, colliderId2);

    if (data1 && data2) {
      const type = isStarted ? COLLISION_START : COLLISION_END;
      data1.entity.add(new EventComponent({eventBus, type, data: data2}));
      data2.entity.add(new EventComponent({eventBus, type, data: data1}));
    } else console.warn("some data not found", data1, data2);
  }

  getDataByCollisionId(colliderId1, colliderId2) {
    const {
      storage: {world},
    } = this;

    const collider1 = world.getCollider(colliderId1);
    const collider2 = world.getCollider(colliderId2);
    const colliders = [collider1, collider2];

    const rigidBody1 = collider1.parent();
    const rigidBody2 = collider2.parent();
    const bodies = [rigidBody1, rigidBody2];

    const csBody = this.getAllComponentsByClass(Body);
    return csBody.reduce((acc, cBody) => {
      const {object: body} = cBody;
      const index = bodies.indexOf(body);
      if (index !== -1) acc[index] = {entity: cBody.entity, collider: colliders[index], body: bodies[index]};
      return acc;
    }, []);
  }

  update() {
    const {
      storage: {eventQueue},
    } = this;
    eventQueue.drainCollisionEvents(this.onCollision);
  }
}
