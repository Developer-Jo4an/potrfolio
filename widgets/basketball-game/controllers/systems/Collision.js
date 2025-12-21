import System from "../../../../shared/scene/ecs/core/System";
import Body from "../../../../shared/scene/ecs/rapier/components/Body";
import EventComponent from "../../../../shared/scene/ecs/base/components/EventComponent";
import {COLLISION_END, COLLISION_START} from "../../constants/events";

export default class Collision extends System {
  constructor() {
    super(...arguments);

    this.onCollision = this.onCollision.bind(this);
  }

  onCollision(colliderId1, colliderId2, isStarted) {
    const {eventBus} = this;
    const [entity1, entity2] = this.getEntitiesByCollisionId(colliderId1, colliderId2);

    if (entity1 && entity2) {
      const type = isStarted ? COLLISION_START : COLLISION_END;
      entity1.add(new EventComponent({eventBus, type, data: {with: entity2}}));
      entity2.add(new EventComponent({eventBus, type, data: {with: entity1}}));
    } else
      console.warn("some entity not found", entity1, entity2);
  }

  getEntitiesByCollisionId(colliderId1, colliderId2) {
    const {storage: {world}} = this;

    const rigidBody1 = world.getCollider(colliderId1).parent();
    const rigidBody2 = world.getCollider(colliderId2).parent();
    const bodies = [rigidBody1, rigidBody2];

    const csBody = this.getAllComponentsByClass(Body);
    return csBody.reduce((acc, cBody) => {
      const {object: body} = cBody;
      const index = bodies.indexOf(body);
      if (index !== -1)
        acc[index] = cBody.entity;
      return acc;
    }, []);
  }

  update() {
    const {storage: {eventQueue}} = this;
    eventQueue.drainCollisionEvents(this.onCollision);
  }
}