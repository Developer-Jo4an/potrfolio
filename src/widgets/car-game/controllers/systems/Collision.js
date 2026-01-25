import {CHARACTER} from "../../constants/entities/character";
import {ROAD_CHUNK} from "../../constants/entities/roadChunk";
import {CHARACTER_WITH_BLOCKS, CHARACTER_WITH_BONUSES, CHARACTER_WITH_ROAD_CHUNK} from "../../constants/collision";
import {BLOCKS_COLLISION, BONUSES_COLLISION} from "../../constants/events";
import {BONUS} from "../../constants/entities/bonus";
import {GAME} from "../../constants/entities/game";
import {BLOCK} from "../../constants/entities/block";
import {LOSE} from "../../constants/stateMachine";
import {Collider, CollisionComponent, EventComponent, Matrix3Component, STATE_DECORATOR_FIELD, System} from "@shared";

export class Collision extends System {
  clearCollisionComponents({characterEntity}) {
    const allCollisionComponent = characterEntity.getList(CollisionComponent);
    allCollisionComponent.forEach((collisionComponent) => characterEntity.remove(collisionComponent));
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

  updateBlockCollider() {
  }

  getCollisionEntities(characterPolygon, entities, type) {
    return entities.filter((entity) => {
      const roadChunkPolygon = entity.get(Collider).object;
      return SAT.testPolygonPolygon(characterPolygon, roadChunkPolygon);
    });
  }

  checkCharacterCollision({characterEntity, roadChunkEntities, bonusEntities, blockEntities}) {
    const {
      eventBus,
      storage: {decorators}
    } = this;
    const characterPolygon = characterEntity.get(Collider).object;

    const collidedRoads = this.getCollisionEntities(characterPolygon, roadChunkEntities, "road");
    if (!collidedRoads?.length) {
      const stateDecorator = decorators[STATE_DECORATOR_FIELD];
      stateDecorator.state = LOSE;
    } else {
      const characterCollisionComponent = new CollisionComponent({
        eventBus,
        group: CHARACTER_WITH_ROAD_CHUNK,
        collision: {collisionList: collidedRoads}
      });
      characterEntity.add(characterCollisionComponent);
    }

    const collidedBonuses = this.getCollisionEntities(characterPolygon, bonusEntities);
    if (!!collidedBonuses?.length) {
      const characterCollisionComponent = new CollisionComponent({
        eventBus,
        group: CHARACTER_WITH_BONUSES,
        collision: {collisionList: collidedBonuses}
      });
      const event = new EventComponent({eventBus, type: BONUSES_COLLISION, data: collidedBonuses});
      characterEntity.add(event);
      characterEntity.add(characterCollisionComponent);
    }

    const collidedBlocks = this.getCollisionEntities(characterPolygon, blockEntities);
    if (!!collidedBlocks?.length) {
      const characterCollisionComponent = new CollisionComponent({
        eventBus,
        group: CHARACTER_WITH_BLOCKS,
        collision: {collisionList: collidedBlocks}
      });
      const event = new EventComponent({eventBus, type: BLOCKS_COLLISION, data: collidedBlocks});
      characterEntity.add(event);
      characterEntity.add(characterCollisionComponent);
    }
  }

  update() {
    const gameEntity = this.getFirstEntityByType(GAME);
    const characterEntity = this.getFirstEntityByType(CHARACTER);
    const roadChunkEntities = this.getEntitiesByType(ROAD_CHUNK).list;
    const bonusEntities = this.getEntitiesByType(BONUS).list;
    const blockEntities = this.getEntitiesByType(BLOCK).list;
    const fullArguments = {gameEntity, characterEntity, roadChunkEntities, bonusEntities, blockEntities, arguments};
    this.clearCollisionComponents(fullArguments);
    this.updateCharacterCollider(fullArguments);
    this.updateRoadChunksCollider(fullArguments);
    this.updateBonusCollider(fullArguments);
    this.updateBlockCollider(fullArguments);
    this.checkCharacterCollision(fullArguments);
  }
}
