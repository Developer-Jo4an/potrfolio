import {CHARACTER} from "../../constants/entities/character";
import {ROAD_CHUNK} from "../../constants/entities/roadChunk";
import {CHARACTER_WITH_BONUSES, CHARACTER_WITH_ROAD_CHUNK, CHARACTER_WITH_SPIKES} from "../../constants/collision";
import {BONUSES_COLLISION, SPIKES_COLLISION} from "../../constants/events";
import {BONUS} from "../../constants/entities/bonus";
import {GAME} from "../../constants/entities/game";
import {SPIKE} from "../../constants/entities/spike";
import {LOSE} from "../../constants/stateMachine";
import {STATE_DECORATOR_FIELD, EventComponent, Collider, Matrix3Component, CollisionComponent, System} from "@shared";

export class Collision extends System {
  clearCollisionComponents({characterEntity}) {
    const allCollisionComponent = characterEntity.getList(CollisionComponent);
    allCollisionComponent.forEach(collisionComponent => characterEntity.remove(collisionComponent));
  }

  updateCharacterCollider({characterEntity}) {
    const characterSatColliderComponent = characterEntity.get(Collider);
    const characterMatrix3Component = characterEntity.get(Matrix3Component);
    const characterPolygon = characterSatColliderComponent.object;
    characterPolygon.pos.x = characterMatrix3Component.x;
    characterPolygon.pos.y = characterMatrix3Component.y;
    characterPolygon.setAngle(characterMatrix3Component.rotation);
  }

  updateRoadChunksCollider() {
  }

  updateBonusCollider() {

  }

  updateSpikeCollider() {

  }

  getCollisionEntities(characterPolygon, entities) {
    return entities.filter(entity => {
      const roadChunkPolygon = entity.get(Collider).object;
      return SAT.testPolygonPolygon(characterPolygon, roadChunkPolygon);
    });
  }

  checkCharacterCollision({characterEntity, roadChunkEntities, bonusEntities, spikeEntities}) {
    const {eventBus, storage: {decorators}} = this;
    const characterPolygon = characterEntity.get(Collider).object;

    const collidedRoads = this.getCollisionEntities(characterPolygon, roadChunkEntities);
    if (!collidedRoads?.length) {
      const stateDecorator = decorators[STATE_DECORATOR_FIELD];
      stateDecorator.state = LOSE;
    } else {
      const characterCollisionComponent = new CollisionComponent({
        eventBus,
        group: CHARACTER_WITH_ROAD_CHUNK,
        collision: {
          collisionList: collidedRoads
        }
      });
      characterEntity.add(characterCollisionComponent);
    }

    const collidedBonuses = this.getCollisionEntities(characterPolygon, bonusEntities);
    if (!!collidedBonuses?.length) {
      const characterCollisionComponent = new CollisionComponent({
        eventBus,
        group: CHARACTER_WITH_BONUSES,
        collision: {
          collisionList: collidedBonuses
        }
      });
      const event = new EventComponent({eventBus, type: BONUSES_COLLISION, data: collidedBonuses});
      characterEntity.add(event);
      characterEntity.add(characterCollisionComponent);
    }

    const collidedSpikes = this.getCollisionEntities(characterPolygon, spikeEntities);
    if (!!collidedSpikes?.length) {
      const characterCollisionComponent = new CollisionComponent({
        eventBus,
        group: CHARACTER_WITH_SPIKES,
        collision: {
          collisionList: collidedSpikes
        }
      });
      const event = new EventComponent({eventBus, type: SPIKES_COLLISION, data: collidedSpikes});
      characterEntity.add(event);
      characterEntity.add(characterCollisionComponent);
    }
  }

  update() {
    const gameEntity = this.getFirstEntityByType(GAME);
    const characterEntity = this.getFirstEntityByType(CHARACTER);
    const roadChunkEntities = this.getEntitiesByType(ROAD_CHUNK).list;
    const bonusEntities = this.getEntitiesByType(BONUS).list;
    const spikeEntities = this.getEntitiesByType(SPIKE).list;
    const fullArguments = {gameEntity, characterEntity, roadChunkEntities, bonusEntities, spikeEntities, arguments};
    this.clearCollisionComponents(fullArguments);
    this.updateCharacterCollider(fullArguments);
    this.updateRoadChunksCollider(fullArguments);
    this.updateBonusCollider(fullArguments);
    this.updateSpikeCollider(fullArguments);
    this.checkCharacterCollision(fullArguments);
  }
}
