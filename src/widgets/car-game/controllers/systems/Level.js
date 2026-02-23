import {cloneDeep} from "lodash";
import {getRandomPointInQuadrilateralBilinear} from "../../utils/helpers/getRandomPointInQuadrilateralBilinear";
import {getIsInsideCanvas} from "../../utils/helpers/getIsInsideCanvas";
import {CHARACTER} from "../constants/entities/character";
import {MAIN_CONTAINER} from "../constants/entities/mainContainer";
import {ROAD_CHUNK} from "../constants/entities/roadChunk";
import {CHARACTER_WITH_BONUSES, CHARACTER_WITH_ROAD_CHUNK, CHARACTER_WITH_BLOCKS} from "../constants/collision";
import {BONUS} from "../constants/entities/bonus";
import {BLOCK} from "../constants/entities/block";
import {ROAD_CHUNKS_CONTAINER} from "../constants/entities/roadChunksContainer";
import {Chunk} from "../components/Chunk";
import {
  getRandomIntFromRange,
  chance,
  LEFT,
  RIGHT,
  Entity,
  System,
  CollisionComponent,
  Matrix3Component,
  PixiComponent,
  Collider,
} from "@shared";

export class Level extends System {
  initializationLevelSelect() {
    this.initMainContainer();
    this.initRoadChunksContainer();
    this.initCharacter();
    this.initMapEntities();
    this.updateRoadChunksContainerMask();
  }

  initMainContainer() {
    const {
      eventBus,
      storage: {stage},
    } = this;
    const mainContainerEntity = new Entity({eventBus, type: MAIN_CONTAINER}).init();
    const mainContainerPixiComponent = mainContainerEntity.get(PixiComponent);
    const mainContainerView = this.getAsset(mainContainerEntity, MAIN_CONTAINER);
    mainContainerPixiComponent.pixiObject = mainContainerView;
    stage.addChild(mainContainerView);
  }

  initRoadChunksContainer() {
    const {eventBus} = this;
    const roadChunksContainerEntity = new Entity({eventBus, type: ROAD_CHUNKS_CONTAINER}).init();
    const roadChunksContainerPixiComponent = roadChunksContainerEntity.get(PixiComponent);
    const roadChunksContainerView = this.getAsset(roadChunksContainerEntity, ROAD_CHUNKS_CONTAINER);
    roadChunksContainerPixiComponent.pixiObject = roadChunksContainerView;
    const mainContainerEntity = this.getFirstEntityByType(MAIN_CONTAINER);
    const mainContainerPixiComponent = mainContainerEntity.get(PixiComponent);
    mainContainerPixiComponent.pixiObject.addChild(roadChunksContainerView);
  }

  initCharacter() {
    const {
      eventBus,
      storage: {
        mainSceneSettings: {
          character: {width, height, startPosition, rotationFromDirection},
        },
        gameSpace: {
          characterMovement: {currentDirection},
        },
      },
    } = this;

    const characterEntity = new Entity({eventBus, type: CHARACTER}).init();

    // вьюха
    const characterPixiComponent = characterEntity.get(PixiComponent);
    const characterView = this.getAsset(characterEntity, CHARACTER);
    characterPixiComponent.pixiObject = characterView;
    const mainContainerEntity = this.getFirstEntityByType(MAIN_CONTAINER);
    const mainContainerPixiComponent = mainContainerEntity.get(PixiComponent);
    mainContainerPixiComponent.pixiObject.addChild(characterView);

    // матрица трансформации
    const characterMatrix3Component = characterEntity.get(Matrix3Component);
    characterMatrix3Component.scaleX = characterMatrix3Component.scaleY = Math.min(
      width / characterView.width,
      height / characterView.height,
    );
    characterMatrix3Component.x = startPosition.x;
    characterMatrix3Component.y = startPosition.y;
    characterMatrix3Component.rotation = rotationFromDirection[currentDirection];

    // коллайдер
    const characterColliderComponent = characterEntity.get(Collider);
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const characterPolygon = new SAT.Polygon(new SAT.Vector(characterMatrix3Component.x, characterMatrix3Component.y), [
      new SAT.Vector(-halfWidth, halfHeight),
      new SAT.Vector(halfWidth, halfHeight),
      new SAT.Vector(halfWidth, -halfHeight),
      new SAT.Vector(-halfWidth, -halfHeight),
    ]);
    characterPolygon.setAngle(characterMatrix3Component.rotation);
    characterColliderComponent.object = characterPolygon;
  }

  initMapEntities() {
    const {
      storage: {
        mainSceneSettings: {
          roadChunks: {
            generate: {count, minStartCount},
          },
        },
      },
    } = this;
    const cycles = Math.ceil(minStartCount / count);
    for (let i = 0; i < cycles; i++) this.createMapEntities();
  }

  initRoadChunkChunkComponent({roadChunkEntity, prevChunkComponent}) {
    const {
      storage: {
        mainSceneSettings: {
          character: {rotationFromDirection},
          roadChunks: {width, height, sparePoint},
        },
      },
    } = this;

    const direction = {[RIGHT]: LEFT, [LEFT]: RIGHT}[prevChunkComponent?.direction] ?? LEFT;

    const startWidth = prevChunkComponent?.width.end ?? getRandomIntFromRange(width.min, width.max);
    const startPoint = cloneDeep(prevChunkComponent?.points.end ?? sparePoint);
    const startPointFirst = {x: startPoint.x - startWidth / 2, y: startPoint.y};
    const startPointSecond = {x: startPoint.x + startWidth / 2, y: startPoint.y};

    const oppositeLeg = getRandomIntFromRange(height.min, height.max);
    const adjacentLeg = Math.tan(Math.PI / 2 - Math.abs(rotationFromDirection[direction])) * oppositeLeg;
    const multiplier = {[LEFT]: -1, [RIGHT]: 1}[direction];

    const endWidth = getRandomIntFromRange(width.min, width.max);
    const endPoint = {x: startPoint.x + multiplier * adjacentLeg, y: startPoint.y - oppositeLeg};
    const endPointFirst = {x: endPoint.x + endWidth / 2, y: endPoint.y};
    const endPointSecond = {x: endPoint.x - endWidth / 2, y: endPoint.y};

    const roadChunkChunkComponent = roadChunkEntity.get(Chunk);
    roadChunkChunkComponent.points = {
      start: startPoint,
      startPointFirst,
      startPointSecond,
      end: endPoint,
      endPointFirst,
      endPointSecond,
    };
    roadChunkChunkComponent.width = {start: startWidth, end: endWidth};
    roadChunkChunkComponent.adjacentLeg = adjacentLeg;
    roadChunkChunkComponent.oppositeLeg = oppositeLeg;
    roadChunkChunkComponent.direction = direction;
    roadChunkEntity.add(roadChunkChunkComponent);
  }

  initRoadChunkPixiComponent({roadChunkEntity, roadChunksContainerEntity}) {
    const roadChunkPixiComponent = roadChunkEntity.get(PixiComponent);
    const roadChunkView = (roadChunkPixiComponent.pixiObject = this.getAsset(roadChunkEntity, ROAD_CHUNK));
    const roadChunksContainerPixiComponent = roadChunksContainerEntity.get(PixiComponent);
    roadChunksContainerPixiComponent.pixiObject.addChild(roadChunkView);
  }

  initRoadChunkSatComponent({roadChunkEntity}) {
    const roadChunkChunkComponent = roadChunkEntity.get(Chunk);
    const roadChunkSatColliderComponent = roadChunkEntity.get(Collider);
    const {
      points: {startPointFirst, startPointSecond, endPointFirst, endPointSecond},
    } = roadChunkChunkComponent;

    const roadChunkPolygonPoints = [startPointFirst, startPointSecond, endPointFirst, endPointSecond].map(
      ({x, y}, index, points) => {
        const nextPoint = points[index + 1] ?? points[0];
        return new SAT.Vector(nextPoint.x, nextPoint.y);
      },
    );
    roadChunkSatColliderComponent.object = new SAT.Polygon(new SAT.Vector(0, 0), roadChunkPolygonPoints);
  }

  initRoadChunkMatrix3Component({roadChunkEntity}) {
    const {
      storage: {
        mainSceneSettings: {
          roadChunks: {height, width, tileScale},
          character: {rotationFromDirection},
        },
      },
    } = this;

    const roadChunkMatrix3Component = roadChunkEntity.get(Matrix3Component);
    const roadChunkChunkComponent = roadChunkEntity.get(Chunk);
    const roadChunkPixiComponent = roadChunkEntity.get(PixiComponent);

    const angle = Math.abs(rotationFromDirection[roadChunkChunkComponent.direction]);
    const maxHeight = height.max;
    const maxWidth = (maxHeight * Math.tan(angle) + width.max / 2) * 2;

    const spriteScale = Math.max(
      maxHeight / roadChunkPixiComponent.pixiObject.height,
      maxWidth / roadChunkPixiComponent.pixiObject.width,
    );
    roadChunkMatrix3Component.scaleX = roadChunkMatrix3Component.scaleY = spriteScale;

    roadChunkMatrix3Component.x = roadChunkChunkComponent.points.start.x;
    roadChunkMatrix3Component.y = roadChunkChunkComponent.points.start.y;

    roadChunkPixiComponent.pixiObject.tilePosition.set(
      -roadChunkMatrix3Component.x / roadChunkMatrix3Component.scaleX,
      -roadChunkMatrix3Component.y / roadChunkMatrix3Component.scaleY,
    );

    roadChunkPixiComponent.pixiObject.tileScale.set(tileScale.x / spriteScale, tileScale.y / spriteScale);
  }

  initBonus(roadChunkEntity) {
    const {
      eventBus,
      storage: {
        mainSceneSettings: {
          bonus: {width, height, chance: bonusChance},
        },
      },
    } = this;
    if (!chance(bonusChance)) return;
    const mainContainerEntity = this.getFirstEntityByType(MAIN_CONTAINER);
    const mainContainerPixiComponent = mainContainerEntity.get(PixiComponent);
    const bonusEntity = new Entity({eventBus, type: BONUS}).init();
    const bonusMatrix3Component = bonusEntity.get(Matrix3Component);
    const bonusPixiComponent = bonusEntity.get(PixiComponent);
    bonusPixiComponent.pixiObject = this.getAsset(bonusEntity, BONUS);
    bonusMatrix3Component.scaleX = width / bonusPixiComponent.pixiObject.width;
    bonusMatrix3Component.scaleY = height / bonusPixiComponent.pixiObject.height;
    const {
      points: {startPointFirst, startPointSecond, endPointFirst, endPointSecond},
    } = roadChunkEntity.get(Chunk);
    const bonusViewWidthHalf = width / 2;
    const bonusViewHeightHalf = height / 2;
    const allowedSpawnArea = [
      {x: startPointFirst.x + bonusViewWidthHalf, y: startPointFirst.y - bonusViewHeightHalf},
      {x: startPointSecond.x - bonusViewWidthHalf, y: startPointSecond.y - bonusViewHeightHalf},
      {x: endPointFirst.x - bonusViewWidthHalf, y: endPointFirst.y + bonusViewHeightHalf},
      {x: endPointSecond.x + bonusViewWidthHalf, y: endPointSecond.y + bonusViewHeightHalf},
    ];
    const spawnPosition = getRandomPointInQuadrilateralBilinear(...allowedSpawnArea);
    bonusMatrix3Component.x = spawnPosition.x;
    bonusMatrix3Component.y = spawnPosition.y;
    mainContainerPixiComponent.pixiObject.addChild(bonusPixiComponent.pixiObject);

    const bonusSatColliderComponent = bonusEntity.get(Collider);
    bonusSatColliderComponent.object = new SAT.Polygon(new SAT.Vector(0, 0), [
      new SAT.Vector(bonusMatrix3Component.x - bonusViewWidthHalf, bonusMatrix3Component.y + bonusViewHeightHalf),
      new SAT.Vector(bonusMatrix3Component.x + bonusViewWidthHalf, bonusMatrix3Component.y + bonusViewHeightHalf),
      new SAT.Vector(bonusMatrix3Component.x + bonusViewWidthHalf, bonusMatrix3Component.y - bonusViewHeightHalf),
      new SAT.Vector(bonusMatrix3Component.x - bonusViewWidthHalf, bonusMatrix3Component.y - bonusViewHeightHalf),
    ]);
  }

  initBlock(roadChunkEntity) {
    const {
      eventBus,
      storage: {
        mainSceneSettings: {
          block: {width, height, chance: blockChance},
        },
      },
    } = this;

    if (!chance(blockChance)) return;

    const mainContainerEntity = this.getFirstEntityByType(MAIN_CONTAINER);
    const mainContainerPixiComponent = mainContainerEntity.get(PixiComponent);
    const blockEntity = new Entity({eventBus, type: BLOCK}).init();
    const blockMatrix3Component = blockEntity.get(Matrix3Component);
    const blockPixiComponent = blockEntity.get(PixiComponent);
    blockPixiComponent.pixiObject = this.getAsset(blockEntity, BLOCK);
    blockMatrix3Component.scaleX = width / blockPixiComponent.pixiObject.width;
    blockMatrix3Component.scaleY = height / blockPixiComponent.pixiObject.height;
    const {
      points: {startPointFirst, startPointSecond, endPointFirst, endPointSecond},
    } = roadChunkEntity.get(Chunk);
    const blockViewWidthHalf = width / 2;
    const blockViewHeightHalf = height / 2;
    const allowedSpawnArea = [
      {x: startPointFirst.x + blockViewWidthHalf, y: startPointFirst.y - blockViewHeightHalf},
      {x: startPointSecond.x - blockViewWidthHalf, y: startPointSecond.y - blockViewHeightHalf},
      {x: endPointFirst.x - blockViewWidthHalf, y: endPointFirst.y + blockViewHeightHalf},
      {x: endPointSecond.x + blockViewWidthHalf, y: endPointSecond.y + blockViewHeightHalf},
    ];
    const spawnPosition = getRandomPointInQuadrilateralBilinear(...allowedSpawnArea);
    blockMatrix3Component.x = spawnPosition.x;
    blockMatrix3Component.y = spawnPosition.y;
    mainContainerPixiComponent.pixiObject.addChild(blockPixiComponent.pixiObject);
    const blockSatColliderComponent = blockEntity.get(Collider);
    blockSatColliderComponent.object = new SAT.Polygon(new SAT.Vector(0, 0), [
      new SAT.Vector(blockMatrix3Component.x - blockViewWidthHalf, blockMatrix3Component.y + blockViewHeightHalf),
      new SAT.Vector(blockMatrix3Component.x + blockViewWidthHalf, blockMatrix3Component.y + blockViewHeightHalf),
      new SAT.Vector(blockMatrix3Component.x + blockViewWidthHalf, blockMatrix3Component.y - blockViewHeightHalf),
      new SAT.Vector(blockMatrix3Component.x - blockViewWidthHalf, blockMatrix3Component.y - blockViewHeightHalf),
    ]);
  }

  createMapEntities() {
    const {
      eventBus,
      storage: {
        mainSceneSettings: {
          roadChunks: {
            generate: {count},
          },
        },
      },
    } = this;

    const mainContainerEntity = this.getFirstEntityByType(MAIN_CONTAINER);
    const roadChunksContainerEntity = this.getFirstEntityByType(ROAD_CHUNKS_CONTAINER);
    const roadChunkEntitiesLength = (this.getEntitiesByType(ROAD_CHUNK)?.list ?? [])?.length;
    for (let i = roadChunkEntitiesLength; i < roadChunkEntitiesLength + count; i++) {
      // Предыдущий чанк
      // [...[]] - Чтобы сохранить кол-во на момент создания
      const roadChunkEntities = [...(this.getEntitiesByType(ROAD_CHUNK)?.list ?? [])];
      const prevRoadChunkEntity = roadChunkEntities[i - 1];
      const prevChunkComponent = prevRoadChunkEntity?.get(Chunk);
      // Инициализация нового чанка
      const roadChunkEntity = new Entity({eventBus, type: ROAD_CHUNK}).init();
      const props = {roadChunkEntity, prevChunkComponent, roadChunksContainerEntity, mainContainerEntity};
      this.initRoadChunkChunkComponent(props);
      this.initRoadChunkPixiComponent(props);
      this.initRoadChunkSatComponent(props);
      this.initRoadChunkMatrix3Component(props);
      this.initBonus(roadChunkEntity);
      this.initBlock(roadChunkEntity);
    }
  }

  checkOnIsInsideCanvasAndDestroy(entities) {
    const {
      storage: {canvas},
    } = this;
    let isDestroyed = false;

    const savedEntities = [...entities];
    savedEntities.forEach((entity) => {
      const pixiComponent = entity.get(PixiComponent);
      const bounds = pixiComponent.pixiObject.getBounds(true);
      pixiComponent.pixiObject.renderable = getIsInsideCanvas(bounds, canvas);
      if (bounds.minY > canvas.offsetHeight) {
        entity.destroy();
        isDestroyed = true;
      }
    });

    return isDestroyed;
  }

  checkOnRoadChunksIsInsideInCanvasAndDestroy({roadChunkEntities, roadChunksContainerEntity}) {
    const {
      storage: {canvas},
    } = this;
    const roadChunksContainerPixiComponent = roadChunksContainerEntity.get(PixiComponent);
    let isDestroyed = false;

    [...roadChunkEntities].forEach((roadChunkEntity) => {
      const {
        points: {startPointFirst, startPointSecond, endPointFirst, endPointSecond},
      } = roadChunkEntity.get(Chunk);
      const {xs, ys} = [startPointFirst, startPointSecond, endPointFirst, endPointSecond].reduce(
        (acc, {x, y}) => {
          const globalPoint = roadChunksContainerPixiComponent.pixiObject.toGlobal({x, y});
          acc.xs.push(globalPoint.x);
          acc.ys.push(globalPoint.y);
          return acc;
        },
        {xs: [], ys: []},
      );
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);

      const roadChunkPixiComponent = roadChunkEntity.get(PixiComponent);
      roadChunkPixiComponent.pixiObject.visible = getIsInsideCanvas({minX, maxX, minY, maxY}, canvas);

      if (minY > canvas.offsetHeight) {
        roadChunkEntity.destroy();
        isDestroyed = true;
      }
    });

    return isDestroyed;
  }

  checkOnAddEntities({characterEntity, roadChunkEntities}) {
    const {
      storage: {
        mainSceneSettings: {
          roadChunks: {
            generate: {minCountForGenerate},
          },
        },
      },
    } = this;
    const collisionComponents = characterEntity.getList(CollisionComponent);

    if (!collisionComponents?.length) return; //NOTE: Только на первом кадре может быть такая ситуёвина, так как система коллизий еще не обновилась
    const {collisionList} = collisionComponents.find(({group}) => group === CHARACTER_WITH_ROAD_CHUNK);
    const indexes = collisionList.map((roadChunkEntity) => roadChunkEntities.indexOf(roadChunkEntity));
    const isCanUpdate = indexes.some((index) => roadChunkEntities?.length - index < minCountForGenerate);
    isCanUpdate && this.createMapEntities();
    return isCanUpdate;
  }

  /**
   * bonus
   */
  checkOnCollisionWithBonuses({characterEntity}) {
    const characterCollisionComponents = characterEntity.getList(CollisionComponent);
    const characterCollisionWithBonuses = characterCollisionComponents.find(
      ({group}) => group === CHARACTER_WITH_BONUSES,
    );
    if (characterCollisionWithBonuses)
      characterCollisionWithBonuses.collisionList.forEach((entity) => entity.destroy());
  }

  /**
   * block
   */
  checkOnCollisionWithBlocks({characterEntity}) {
    const characterCollisionComponents = characterEntity.getList(CollisionComponent);
    const characterCollisionWithBlocks = characterCollisionComponents.find(
      ({group}) => group === CHARACTER_WITH_BLOCKS,
    );
    if (characterCollisionWithBlocks) characterCollisionWithBlocks.collisionList.forEach((entity) => entity.destroy());
  }

  updateRoadChunksContainerMask() {
    const roadChunksContainerEntity = this.getFirstEntityByType(ROAD_CHUNKS_CONTAINER);
    const roadChunkViewMask = roadChunksContainerEntity.get(PixiComponent).pixiObject.mask;
    const roadChunkEntities = this.getEntitiesByType(ROAD_CHUNK).list ?? [];
    const roadChunksChunksPoints = roadChunkEntities.map((roadChunkEntity) => roadChunkEntity.get(Chunk).points);

    roadChunkViewMask.clear();
    roadChunksChunksPoints.forEach(({startPointFirst, startPointSecond, endPointFirst}, index) => {
      if (!index) {
        roadChunkViewMask.moveTo(startPointFirst.x, startPointFirst.y);
        roadChunkViewMask.lineTo(startPointSecond.x, startPointSecond.y);
      } else roadChunkViewMask.lineTo(startPointSecond.x, startPointSecond.y);
    });
    [...roadChunksChunksPoints]
      .reverse()
      .forEach(({startPointFirst, startPointSecond, endPointFirst, endPointSecond}, index) => {
        if (!index) roadChunkViewMask.lineTo(endPointSecond.x, endPointSecond.y);
        roadChunkViewMask.lineTo(startPointFirst.x, startPointFirst.y);
      });
    roadChunkViewMask.closePath();
    roadChunkViewMask.fill(0xffffff);
  }

  update() {
    const characterEntity = this.getFirstEntityByType(CHARACTER);
    const mainContainerEntity = this.getFirstEntityByType(MAIN_CONTAINER);
    const roadChunksContainerEntity = this.getFirstEntityByType(ROAD_CHUNKS_CONTAINER);
    const roadChunkEntities = this.getEntitiesByType(ROAD_CHUNK).list;
    const bonusEntities = this.getEntitiesByType(BONUS).list;
    const blockEntities = this.getEntitiesByType(BLOCK).list;

    const fullArguments = {
      characterEntity,
      mainContainerEntity,
      roadChunksContainerEntity,
      roadChunkEntities,
      arguments,
    };

    this.checkOnCollisionWithBonuses(fullArguments);
    this.checkOnCollisionWithBlocks(fullArguments);

    const isDestroyedBonuses = this.checkOnIsInsideCanvasAndDestroy(bonusEntities);
    const isDestroyedBlocks = this.checkOnIsInsideCanvasAndDestroy(blockEntities);
    const isDestroyedRoadChunks = this.checkOnRoadChunksIsInsideInCanvasAndDestroy(fullArguments);

    const isAddedEntities = this.checkOnAddEntities(fullArguments);

    if (isAddedEntities || isDestroyedRoadChunks) this.updateRoadChunksContainerMask();
  }
}
