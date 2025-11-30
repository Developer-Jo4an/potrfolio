import SatCollider from "../components/SatCollider";
import System from "../../../../shared/scene/ecs/core/System";
import PixiComponent from "../../../../shared/scene/ecs/pixi/components/PixiComponent";
import Matrix3Component from "../../../../shared/scene/ecs/base/components/transform/Matrix3Component";
import CollisionComponent from "../../../../shared/scene/ecs/base/components/collision/CollisionComponent";
import Entity from "../../../../shared/scene/ecs/core/Entity";
import Chunk from "../components/Chunk";
import {cloneDeep} from "lodash";
import getRandomPointInQuadrilateralBilinear from "../../utils/helpers/getRandomPointInQuadrilateralBilinear";
import chance from "../../../../shared/lib/random/chance";
import getRandomIntFromRange from "../../../../shared/lib/random/getRandomIntFromRange";
import getIsInsideCanvas from "../../utils/helpers/getIsInsideCanvas";
import {CHARACTER} from "../../constants/entities/character";
import {MAIN_CONTAINER} from "../../constants/entities/mainContainer";
import {ROAD_CHUNK} from "../../constants/entities/roadChunk";
import {CHARACTER_WITH_BONUSES, CHARACTER_WITH_ROAD_CHUNK, CHARACTER_WITH_SPIKES} from "../../constants/collision";
import {BONUS} from "../../constants/entities/bonus";
import {SPIKE} from "../../constants/entities/spike";
import {LEFT, RIGHT} from "../../../../shared/constants/directions/directions";
import global from "../../../../shared/constants/global/global";

export default class Level extends System {
  initializationLevelSelect() {
    this.initMainContainer();
    this.initCharacter();
    this.initMapEntities();
  }

  initMainContainer() {
    const {eventBus, storage: {stage}} = this;
    const mainContainerEntity = new Entity({eventBus, type: MAIN_CONTAINER}).init();
    const mainContainerPixiComponent = mainContainerEntity.get(PixiComponent);
    const mainContainerView = this.getAsset(mainContainerEntity, MAIN_CONTAINER);
    mainContainerPixiComponent.pixiObject = mainContainerView;
    stage.addChild(mainContainerView);
  }

  initCharacter() {
    const {
      eventBus, storage: {
        mainSceneSettings: {
          character: {
            width, height, startPosition, rotationFromDirection
          }
        },
        gameSpace: {
          characterMovement: {
            currentDirection
          }
        }
      }
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
      height / characterView.height
    );
    characterMatrix3Component.x = startPosition.x;
    characterMatrix3Component.y = startPosition.y;
    characterMatrix3Component.rotation = rotationFromDirection[currentDirection];

    // коллайдер
    const characterColliderComponent = characterEntity.get(SatCollider);
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const characterPolygon = new global.SAT.Polygon(
      new global.SAT.Vector(characterMatrix3Component.x, characterMatrix3Component.y),
      [
        new global.SAT.Vector(-halfWidth, halfHeight),
        new global.SAT.Vector(halfWidth, halfHeight),
        new global.SAT.Vector(halfWidth, -halfHeight),
        new global.SAT.Vector(-halfWidth, -halfHeight)
      ]
    );
    characterPolygon.setAngle(characterMatrix3Component.rotation);
    characterColliderComponent.satObject = characterPolygon;
  }

  initMapEntities() {
    const {storage: {mainSceneSettings: {roadChunks: {generate: {count, minStartCount}}}}} = this;
    const cycles = Math.ceil(minStartCount / count);
    for (let i = 0; i < cycles; i++)
      this.createMapEntities();
  }

  initRoadChunkChunkComponent({roadChunkEntity, prevChunkComponent}) {
    const {
      storage: {
        mainSceneSettings: {
          character: {rotationFromDirection},
          roadChunks: {width, height, sparePoint}
        }
      }
    } = this;

    const direction = {[RIGHT]: LEFT, [LEFT]: RIGHT}[prevChunkComponent?.direction] ?? LEFT;

    const startWidth = prevChunkComponent?.width.end ?? getRandomIntFromRange(width.min, width.max);
    const startPoint = cloneDeep(prevChunkComponent?.points.end ?? sparePoint);
    const startPointFirst = {x: startPoint.x - startWidth / 2, y: startPoint.y};
    const startPointSecond = {x: startPoint.x + startWidth / 2, y: startPoint.y};

    const oppositeLeg = getRandomIntFromRange(height.min, height.max);
    const adjacentLeg = Math.tan(Math.PI / 2 - Math.abs(rotationFromDirection[direction])) * oppositeLeg;
    const multiplier = ({[LEFT]: -1, [RIGHT]: 1})[direction];

    const endWidth = getRandomIntFromRange(width.min, width.max);
    const endPoint = {
      x: startPoint.x + multiplier * adjacentLeg,
      y: startPoint.y - oppositeLeg
    };
    const endPointFirst = {x: endPoint.x + endWidth / 2, y: endPoint.y};
    const endPointSecond = {x: endPoint.x - endWidth / 2, y: endPoint.y};

    const roadChunkChunkComponent = roadChunkEntity.get(Chunk);
    roadChunkChunkComponent.points = {
      start: startPoint, startPointFirst, startPointSecond,
      end: endPoint, endPointFirst, endPointSecond
    };
    roadChunkChunkComponent.width = {
      start: startWidth,
      end: endWidth
    };
    roadChunkChunkComponent.adjacentLeg = adjacentLeg;
    roadChunkChunkComponent.oppositeLeg = oppositeLeg;
    roadChunkChunkComponent.direction = direction;
    roadChunkEntity.add(roadChunkChunkComponent);
  }

  initRoadChunkPixiComponent({roadChunkEntity}) {
    const mainContainerEntity = this.getFirstEntityByType(MAIN_CONTAINER);
    const mainContainerPixiComponent = mainContainerEntity.get(PixiComponent);
    const roadChunkChunkComponent = roadChunkEntity.get(Chunk);
    const {points: {startPointFirst, startPointSecond, endPointFirst, endPointSecond}} = roadChunkChunkComponent;

    const roadChunkPixiComponent = roadChunkEntity.get(PixiComponent);
    const roadChunkView = roadChunkPixiComponent.pixiObject = this.getAsset(roadChunkEntity, ROAD_CHUNK);
    [startPointFirst, startPointSecond, endPointFirst, endPointSecond].forEach(({x, y}, index, points) => {
      !index && roadChunkView.mask.moveTo(x, y);
      const nextPoint = points[index + 1] ?? points[0];
      roadChunkView.mask.lineTo(nextPoint.x, nextPoint.y);
    });
    roadChunkView.mask.closePath();
    roadChunkView.mask.fill(0xffffff);
    mainContainerPixiComponent.pixiObject.addChild(roadChunkView);
    mainContainerPixiComponent.pixiObject.addChildAt(roadChunkView.mask, 0);
  }

  initRoadChunkSatComponent({roadChunkEntity}) {
    const roadChunkChunkComponent = roadChunkEntity.get(Chunk);
    const roadChunkSatColliderComponent = roadChunkEntity.get(SatCollider);
    const {points: {startPointFirst, startPointSecond, endPointFirst, endPointSecond}} = roadChunkChunkComponent;

    const roadChunkPolygonPoints = [startPointFirst, startPointSecond, endPointFirst, endPointSecond].map(
      ({x, y}, index, points) => {
        const nextPoint = points[index + 1] ?? points[0];
        return new global.SAT.Vector(nextPoint.x, nextPoint.y);
      }
    );
    roadChunkSatColliderComponent.satObject = new global.SAT.Polygon(
      new global.SAT.Vector(0, 0),
      roadChunkPolygonPoints
    );
  }

  initRoadChunkMatrix3Component({roadChunkEntity}) {
    const {
      storage: {
        mainSceneSettings: {
          roadChunks: {height, width, tileScale},
          character: {rotationFromDirection}
        }
      }
    } = this;

    const roadChunkMatrix3Component = roadChunkEntity.get(Matrix3Component);
    const roadChunkChunkComponent = roadChunkEntity.get(Chunk);
    const roadChunkPixiComponent = roadChunkEntity.get(PixiComponent);

    const angle = Math.abs(rotationFromDirection[roadChunkChunkComponent.direction]);
    const maxHeight = height.max;
    const maxWidth = (maxHeight * Math.tan(angle) + width.max / 2) * 2;

    const spriteScale = Math.max(
      maxHeight / roadChunkPixiComponent.pixiObject.height,
      maxWidth / roadChunkPixiComponent.pixiObject.width
    );
    roadChunkMatrix3Component.scaleX = roadChunkMatrix3Component.scaleY = spriteScale;

    roadChunkMatrix3Component.x = roadChunkChunkComponent.points.start.x;
    roadChunkMatrix3Component.y = roadChunkChunkComponent.points.start.y;

    roadChunkPixiComponent.pixiObject.tilePosition.set(
      -roadChunkMatrix3Component.x / roadChunkMatrix3Component.scaleX,
      -roadChunkMatrix3Component.y / roadChunkMatrix3Component.scaleY
    );

    roadChunkPixiComponent.pixiObject.tileScale.set(
      tileScale.x / spriteScale,
      tileScale.y / spriteScale
    );
  }

  initBonus(roadChunkEntity) {
    const {eventBus, storage: {mainSceneSettings: {bonus: {width, height, chance: bonusChance}}}} = this;

    if (!chance(bonusChance)) return;

    const mainContainerEntity = this.getFirstEntityByType(MAIN_CONTAINER);
    const mainContainerPixiComponent = mainContainerEntity.get(PixiComponent);
    const bonusEntity = new Entity({eventBus, type: BONUS}).init();
    const bonusMatrix3Component = bonusEntity.get(Matrix3Component);
    const bonusPixiComponent = bonusEntity.get(PixiComponent);
    bonusPixiComponent.pixiObject = this.getAsset(bonusEntity, BONUS);
    bonusMatrix3Component.scaleX = width / bonusPixiComponent.pixiObject.width;
    bonusMatrix3Component.scaleY = height / bonusPixiComponent.pixiObject.height;
    const {points: {startPointFirst, startPointSecond, endPointFirst, endPointSecond}} = roadChunkEntity.get(Chunk);
    const bonusViewWidthHalf = width / 2;
    const bonusViewHeightHalf = height / 2;
    const allowedSpawnArea = [
      {x: startPointFirst.x + bonusViewWidthHalf, y: startPointFirst.y - bonusViewHeightHalf},
      {x: startPointSecond.x - bonusViewWidthHalf, y: startPointSecond.y - bonusViewHeightHalf},
      {x: endPointFirst.x - bonusViewWidthHalf, y: endPointFirst.y + bonusViewHeightHalf},
      {x: endPointSecond.x + bonusViewWidthHalf, y: endPointSecond.y + bonusViewHeightHalf}
    ];
    const spawnPosition = getRandomPointInQuadrilateralBilinear(...allowedSpawnArea);
    bonusMatrix3Component.x = spawnPosition.x;
    bonusMatrix3Component.y = spawnPosition.y;
    mainContainerPixiComponent.pixiObject.addChild(bonusPixiComponent.pixiObject);
    const bonusSatColliderComponent = bonusEntity.get(SatCollider);
    bonusSatColliderComponent.satObject = new global.SAT.Polygon(
      new global.SAT.Vector(0, 0),
      [
        new global.SAT.Vector(bonusMatrix3Component.x - bonusViewWidthHalf, bonusMatrix3Component.y + bonusViewHeightHalf),
        new global.SAT.Vector(bonusMatrix3Component.x + bonusViewWidthHalf, bonusMatrix3Component.y + bonusViewHeightHalf),
        new global.SAT.Vector(bonusMatrix3Component.x + bonusViewWidthHalf, bonusMatrix3Component.y - bonusViewHeightHalf),
        new global.SAT.Vector(bonusMatrix3Component.x - bonusViewWidthHalf, bonusMatrix3Component.y - bonusViewHeightHalf)
      ]
    );
  }

  initSpike(roadChunkEntity) {
    const {eventBus, storage: {mainSceneSettings: {spike: {width, height, chance: spikeChance}}}} = this;

    if (!chance(spikeChance)) return;

    const mainContainerEntity = this.getFirstEntityByType(MAIN_CONTAINER);
    const mainContainerPixiComponent = mainContainerEntity.get(PixiComponent);
    const spikeEntity = new Entity({eventBus, type: SPIKE}).init();
    const spikeMatrix3Component = spikeEntity.get(Matrix3Component);
    const spikePixiComponent = spikeEntity.get(PixiComponent);
    spikePixiComponent.pixiObject = this.getAsset(spikeEntity, SPIKE);
    spikeMatrix3Component.scaleX = width / spikePixiComponent.pixiObject.width;
    spikeMatrix3Component.scaleY = height / spikePixiComponent.pixiObject.height;
    const {points: {startPointFirst, startPointSecond, endPointFirst, endPointSecond}} = roadChunkEntity.get(Chunk);
    const spikeViewWidthHalf = width / 2;
    const spikeViewHeightHalf = height / 2;
    const allowedSpawnArea = [
      {x: startPointFirst.x + spikeViewWidthHalf, y: startPointFirst.y - spikeViewHeightHalf},
      {x: startPointSecond.x - spikeViewWidthHalf, y: startPointSecond.y - spikeViewHeightHalf},
      {x: endPointFirst.x - spikeViewWidthHalf, y: endPointFirst.y + spikeViewHeightHalf},
      {x: endPointSecond.x + spikeViewWidthHalf, y: endPointSecond.y + spikeViewHeightHalf}
    ];
    const spawnPosition = getRandomPointInQuadrilateralBilinear(...allowedSpawnArea);
    spikeMatrix3Component.x = spawnPosition.x;
    spikeMatrix3Component.y = spawnPosition.y;
    mainContainerPixiComponent.pixiObject.addChild(spikePixiComponent.pixiObject);
    const spikeSatColliderComponent = spikeEntity.get(SatCollider);
    spikeSatColliderComponent.satObject = new global.SAT.Polygon(
      new global.SAT.Vector(0, 0),
      [
        new global.SAT.Vector(spikeMatrix3Component.x - spikeViewWidthHalf, spikeMatrix3Component.y + spikeViewHeightHalf),
        new global.SAT.Vector(spikeMatrix3Component.x + spikeViewWidthHalf, spikeMatrix3Component.y + spikeViewHeightHalf),
        new global.SAT.Vector(spikeMatrix3Component.x + spikeViewWidthHalf, spikeMatrix3Component.y - spikeViewHeightHalf),
        new global.SAT.Vector(spikeMatrix3Component.x - spikeViewWidthHalf, spikeMatrix3Component.y - spikeViewHeightHalf)
      ]
    );
  }

  createMapEntities() {
    const {eventBus, storage: {mainSceneSettings: {roadChunks: {generate: {count}}}}} = this;

    const mainContainerEntity = this.getFirstEntityByType(MAIN_CONTAINER);
    const roadChunkEntitiesLength = (this.getEntitiesByType(ROAD_CHUNK)?.list ?? [])?.length;
    for (let i = roadChunkEntitiesLength; i < roadChunkEntitiesLength + count; i++) {
      // Предыдущий чанк
      // [...[]] - Чтобы сохранить кол-во на момент создания
      const roadChunkEntities = [...(this.getEntitiesByType(ROAD_CHUNK)?.list ?? [])];
      const prevRoadChunkEntity = roadChunkEntities[i - 1];
      const prevChunkComponent = prevRoadChunkEntity?.get(Chunk);
      // Инициализация нового чанка
      const roadChunkEntity = new Entity({eventBus, type: ROAD_CHUNK}).init();
      const props = {roadChunkEntity, prevChunkComponent, mainContainerEntity};
      this.initRoadChunkChunkComponent(props);
      this.initRoadChunkPixiComponent(props);
      this.initRoadChunkSatComponent(props);
      this.initRoadChunkMatrix3Component(props);
      this.initBonus(roadChunkEntity);
      this.initSpike(roadChunkEntity);
    }
  }

  checkOnIsInsideCanvasAndDestroy(entities) {
    const {storage: {canvas}} = this;
    entities.forEach(entity => {
      const pixiComponent = entity.get(PixiComponent);
      const bounds = pixiComponent.pixiObject.getBounds();
      const isVisible = getIsInsideCanvas(bounds, canvas);
      pixiComponent.pixiObject.renderable = isVisible;
      pixiComponent.pixiObject.mask && (pixiComponent.pixiObject.mask.renderable = isVisible);
      if (bounds.minY > canvas.offsetHeight)
        entity.destroy();
    });
  }

  checkOnAddEntities({characterEntity, roadChunkEntities}) {
    const {storage: {mainSceneSettings: {roadChunks: {generate: {minCountForGenerate}}}}} = this;
    const collisionComponents = characterEntity.getList(CollisionComponent);

    if (!collisionComponents?.length) return; //NOTE: Только на первом кадре может быть такая ситуёвина, так как система коллизий еще не обновилась

    const {collisionList} = collisionComponents.find(({collisionGroup}) => collisionGroup === CHARACTER_WITH_ROAD_CHUNK);
    const indexes = collisionList.map(roadChunkEntity => roadChunkEntities.indexOf(roadChunkEntity));
    const isCanUpdate = indexes.some(index => roadChunkEntities?.length - index < minCountForGenerate);
    isCanUpdate && this.createMapEntities();
  }

  /**
   * bonus
   */
  checkOnCollisionWithBonuses({characterEntity}) {
    const characterCollisionComponents = characterEntity.getList(CollisionComponent);
    const characterCollisionWithBonuses = characterCollisionComponents.find(({collisionGroup}) => collisionGroup === CHARACTER_WITH_BONUSES);
    if (characterCollisionWithBonuses)
      characterCollisionWithBonuses.collisionList.forEach(entity => entity.destroy());
  }

  /**
   * spike
   */
  checkOnCollisionWithSpikes({characterEntity}) {
    const characterCollisionComponents = characterEntity.getList(CollisionComponent);
    const characterCollisionWithSpikes = characterCollisionComponents.find(({collisionGroup}) => collisionGroup === CHARACTER_WITH_SPIKES);
    if (characterCollisionWithSpikes)
      characterCollisionWithSpikes.collisionList.forEach(entity => entity.destroy());
  }

  update() {
    const characterEntity = this.getFirstEntityByType(CHARACTER);
    const mainContainerEntity = this.getFirstEntityByType(MAIN_CONTAINER);
    const roadChunkEntities = this.getEntitiesByType(ROAD_CHUNK).list;
    const bonusEntities = this.getEntitiesByType(BONUS).list;
    const spikeEntities = this.getEntitiesByType(SPIKE).list;

    const fullArguments = {characterEntity, mainContainerEntity, roadChunkEntities, arguments};

    this.checkOnAddEntities(fullArguments);
    this.checkOnCollisionWithBonuses(fullArguments);
    this.checkOnCollisionWithSpikes(fullArguments);

    this.checkOnIsInsideCanvasAndDestroy(bonusEntities);
    this.checkOnIsInsideCanvasAndDestroy(spikeEntities);
    this.checkOnIsInsideCanvasAndDestroy(roadChunkEntities);
  }
}
