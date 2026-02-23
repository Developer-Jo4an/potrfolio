import {System} from "../../core/System";
import {Entity} from "../../core/Entity";
import {SatCollider} from "../components/SatCollider";
import {CollisionConfig} from "../components/CollisionConfig";
import {lerp} from "../../../../../lib/src/math/MathUtils";
import {COLLISION_CONFIG} from "../entities/collisionConfig";

/**
 * @warning - Подходил только для SAT.Polygon
 */

class SatCollisionSystem extends System {
  get entity() {
    const {eventBus} = this;
    const entity = this.getFirstEntityByType(COLLISION_CONFIG);
    return entity ?? new Entity({type: COLLISION_CONFIG, eventBus}).init();
  }

  get CCDMs() {
    return this.entity.get(CollisionConfig).CCDMs;
  }

  get collisionConfig() {
    return this.entity.get(CollisionConfig).collisionConfig;
  }

  updateItems({deltaMS, entitiesData}) {
    const {collisionConfig} = this;

    for (const group1 in collisionConfig) {
      const entityGroup = entitiesData[group1];
      if (!entityGroup) continue;

      const checkTypes = collisionConfig[group1];

      entityGroup.forEach(({entity: entity1, cSatCollider: cSatCollider1}) => {
        const response = {};

        checkTypes.forEach(group2 => {
          const checkEntityGroup = entitiesData[group2];
          if (!checkEntityGroup) return;

          checkEntityGroup.forEach(({entity: entity2, cSatCollider: cSatCollider2}) => {
            this.checkCollisionBetween(
              response,
              entity1,
              cSatCollider1,
              group1,
              entity2,
              cSatCollider2,
              group2,
              deltaMS
            );
          });
        });

        cSatCollider1.response = response;
      });
    }
  }

  checkCollisionBetween(
    collisionResponseData,
    entity1,
    cSatCollider1,
    group1,
    entity2,
    cSatCollider2,
    group2,
    deltaMS
  ) {
    const {isCollided, isSeparated, response} = this.getCollideData(
      cSatCollider1,
      cSatCollider2,
      deltaMS,
      group2,
      entity2.uuid
    );

    if (isCollided || isSeparated)
      this.setToResponse(collisionResponseData, group2, entity2.uuid, isCollided, isSeparated, response);
  }

  getCollideData() {
    const {isCollided, response} = this.checkOnCollided(...arguments);
    const {isSeparated} = this.checkOnSeparated(...arguments, isCollided);
    return {isCollided, isSeparated, response};
  }

  checkOnCollided(cSatCollider1, cSatCollider2, deltaMS) {
    const {CCDMs} = this;

    const collisionData = {isCollided: false, response: new SAT.Response()};

    const savedColliderData1 = {x: cSatCollider1.x, y: cSatCollider1.y, angle: cSatCollider1.angle};
    const savedColliderData2 = {x: cSatCollider2.x, y: cSatCollider2.y, angle: cSatCollider2.angle};

    const matchesArray = [
      [cSatCollider1, savedColliderData1],
      [cSatCollider2, savedColliderData2]
    ];

    let acc = deltaMS;
    while (acc > 0) {
      const delta = CCDMs - acc < 0 ? CCDMs : acc;
      acc -= delta;
      const progress = (deltaMS - acc) / deltaMS;

      matchesArray.forEach(([cCollider, savedData]) => {
        this.setDataToCollider(
          cCollider.collider,
          lerp(cCollider.prevX, savedData.x, progress),
          lerp(cCollider.prevY, savedData.y, progress),
          lerp(cCollider.prevAngle, savedData.angle, progress)
        );
      });

      collisionData.response.clear();
      const isCollided = SAT.testPolygonPolygon(cSatCollider1.collider, cSatCollider2.collider, collisionData.response);

      if (isCollided) {
        collisionData.isCollided = true;
        break;
      }
    }

    matchesArray.forEach(([cCollider, savedData]) => {
      this.setDataToCollider(cCollider.collider, savedData.x, savedData.y, savedData.angle);
    });

    if (!collisionData.isCollided) collisionData.response.clear();

    return collisionData;
  }

  checkOnSeparated(cSatCollider1, cSatCollider2, deltaMS, group2, entity2UUID, isCollided) {
    if (isCollided) return {isSeparated: false};
    const isSeparated = cSatCollider1.prevResponse?.[group2]?.[entity2UUID]?.isCollided;
    return {isSeparated};
  }

  setToResponse(collisionResponseData, group2, entity2UUID, isCollided, isSeparated, response) {
    const responseData = (collisionResponseData[group2] ??= {});
    responseData[entity2UUID] = {isCollided, isSeparated, response};
  }

  prepareEntitiesData() {
    const entities = {};

    this.filterEntitiesByClass(SatCollider).forEach(entity => {
      const cSatCollider = entity.get(SatCollider);

      const {collider, group, isActive, response} = cSatCollider;
      cSatCollider.prevResponse = response;
      cSatCollider._response = null;

      if (!!collider && !!group && isActive) {
        const entityData = {entity, cSatCollider};
        (entities[group] ??= []).push(entityData);
      }
    });

    return entities;
  }

  setDataToCollider(collider, x, y, angle) {
    collider.pos.x = x;
    collider.pos.y = y;
    collider.setAngle(angle);
  }

  update() {
    super.update(...arguments);

    const {collisionConfig} = this;
    if (!collisionConfig) return;

    const entitiesData = this.prepareEntitiesData();
    const fullProps = {...arguments[0], entitiesData};

    this.updateItems(fullProps);
  }
}

export {SatCollisionSystem};
