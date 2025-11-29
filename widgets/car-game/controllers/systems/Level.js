import SatCollider from "../components/SatCollider";
import System from "../../../../shared/scene/ecs/core/System";
import PixiComponent from "../../../../shared/scene/ecs/pixi/components/PixiComponent";
import Matrix3Component from "../../../../shared/scene/ecs/base/components/transform/Matrix3Component";
import CollisionComponent from "../../../../shared/scene/ecs/base/components/collision/CollisionComponent";
import Entity from "../../../../shared/scene/ecs/core/Entity";
import Chunk from "../components/Chunk";
import {cloneDeep} from "lodash";
import getIsInsideRectangle from "../../utils/helpers/getIsInsideRectangle";
import getRandomPointInQuadrilateralBilinear from "../../utils/helpers/getRandomPointInQuadrilateralBilinear";
import chance from "../../../../shared/lib/random/chance";
import getRandomIntFromRange from "../../../../shared/lib/random/getRandomIntFromRange";
import {CHARACTER} from "../../constants/entities/character";
import {MAIN_CONTAINER} from "../../constants/entities/mainContainer";
import {ROAD_CHUNK} from "../../constants/entities/roadChunk";
import {GAME_SIZE} from "../../constants/game";
import {CHARACTER_WITH_BONUSES, CHARACTER_WITH_ROAD_CHUNK, CHARACTER_WITH_SPIKES} from "../../constants/collision";
import {BONUS} from "../../constants/entities/bonus";
import {SPIKE} from "../../constants/entities/spike";
import global from "../../../../shared/constants/global/global";
import {LEFT, RIGHT} from "../../../../shared/constants/directions/directions";

export default class Level extends System {
  initializationLevelSelect() {
    this.initMainContainer();
    this.initCharacter();
    this.initRoadChunks();
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

  initRoadChunks() {
    const {storage: {mainSceneSettings: {roadChunks: {generate: {count, minStartCount}}}}} = this;
    const cycles = Math.ceil(minStartCount / count);
    for (let i = 0; i < cycles; i++)
      this.createRoadChunks();
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
    mainContainerPixiComponent.pixiObject.addChild(roadChunkView.mask);
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

  initRoadChunkMatrix3Component({roadChunkEntity, roadChunkEntities}) {
    const roadChunkMatrix3Component = roadChunkEntity.get(Matrix3Component);
    const roadChunkView = roadChunkEntity.get(PixiComponent).pixiObject;
    const {points: {start}} = roadChunkEntity.get(Chunk);

    roadChunkMatrix3Component.scaleX = roadChunkMatrix3Component.scaleY = Math.max(
      GAME_SIZE.width / roadChunkView.width,
      GAME_SIZE.height / roadChunkView.height
    );
    roadChunkMatrix3Component.x = GAME_SIZE.width / 2;
    roadChunkMatrix3Component.y = start.y;
    const tileOffset = {
      x: 0, //todo: ошибка, когда генерится новая порция чанков
      y: roadChunkEntities.reduce((acc, roadChunkEntity) => {
        const roadChunkMatrix3Component = roadChunkEntity.get(Matrix3Component);
        const {points: {start, end}} = roadChunkEntity.get(Chunk);
        return acc + (start.y - end.y) / roadChunkMatrix3Component.scaleY;
      }, 0)
    };
    roadChunkView.tilePosition.set(tileOffset.x, tileOffset.y);
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

  createRoadChunks() {
    const {eventBus, storage: {mainSceneSettings: {roadChunks: {generate: {count}}}}} = this;

    const roadChunkEntitiesLength = (this.getEntitiesByType(ROAD_CHUNK)?.list ?? [])?.length;
    for (let i = roadChunkEntitiesLength; i < roadChunkEntitiesLength + count; i++) {
      // Предыдущий чанк
      // [...[]] - Чтобы сохранить кол-во на момент создания
      const roadChunkEntities = [...(this.getEntitiesByType(ROAD_CHUNK)?.list ?? [])];
      const prevRoadChunkEntity = roadChunkEntities[i - 1];
      const prevChunkComponent = prevRoadChunkEntity?.get(Chunk);
      // Инициализация нового чанка
      const roadChunkEntity = new Entity({eventBus, type: ROAD_CHUNK}).init();
      const props = {roadChunkEntity, roadChunkEntities, prevChunkComponent};
      this.initRoadChunkChunkComponent(props);
      this.initRoadChunkPixiComponent(props);
      this.initRoadChunkSatComponent(props);
      this.initRoadChunkMatrix3Component(props);
      this.initBonus(roadChunkEntity);
      this.initSpike(roadChunkEntity);
    }
  }

  checkOnAddRoadChunks({characterEntity, roadChunkEntities}) {
    const {storage: {mainSceneSettings: {roadChunks: {generate: {minCountForGenerate}}}}} = this;
    const collisionComponents = characterEntity.getList(CollisionComponent);

    if (!collisionComponents?.length) return; //NOTE: Только на первом кадре может быть такая ситуёвина, так как система коллизий еще не обновилась

    const {collisionList} = collisionComponents.find(({collisionGroup}) => collisionGroup === CHARACTER_WITH_ROAD_CHUNK);
    const indexes = collisionList.map(roadChunkEntity => roadChunkEntities.indexOf(roadChunkEntity));
    const isCanUpdate = indexes.some(index => roadChunkEntities?.length - index < minCountForGenerate);
    isCanUpdate && this.createRoadChunks();
  }

  optimizationRoadChunks({characterEntity, roadChunkEntities, mainContainerEntity}) {
    const {storage: {mainSceneSettings: {camera: {trackingBoundary}}}} = this;
    const mainContainerMatrix3Component = mainContainerEntity.get(Matrix3Component);
    const characterMatrix3Component = characterEntity.get(Matrix3Component);
    [...roadChunkEntities].forEach(roadChunkEntity => {
      const roadChunkPixiComponent = roadChunkEntity.get(PixiComponent);
      const roadChunkMatrix3Component = roadChunkEntity.get(Matrix3Component);
      const {
        points: {
          start,
          end,
          startPointFirst,
          startPointSecond,
          endPointFirst,
          endPointSecond
        }
      } = roadChunkEntity.get(Chunk);
      const allPoints = [startPointFirst, startPointSecond, endPointFirst, endPointSecond];
      const isInsideViewport = allPoints.some(({x, y}) => {
        const globalX = mainContainerMatrix3Component.x + x;
        const globalY = mainContainerMatrix3Component.y + y;
        return getIsInsideRectangle({x: globalX, y: globalY}, GAME_SIZE);
      });
      roadChunkPixiComponent.pixiObject.visible = isInsideViewport;
      roadChunkPixiComponent.pixiObject.mask.visible = isInsideViewport;
      const positionAfterWhichRemove = characterMatrix3Component.y + GAME_SIZE.height - trackingBoundary;
      const roadChunkHeight = Math.abs(end.y - start.y);
      const totalPositionAfterWhichRemove = positionAfterWhichRemove + roadChunkHeight;
      if (totalPositionAfterWhichRemove < roadChunkMatrix3Component.y)
        roadChunkEntity.destroy();
    });
  }

  optimizationBonuses({bonusEntities, characterEntity, mainContainerEntity}) {
    const {storage: {mainSceneSettings: {bonus: {width, height}, camera: {trackingBoundary}}}} = this;
    const mainContainerMatrix3Component = mainContainerEntity.get(Matrix3Component);
    const characterMatrix3Component = characterEntity.get(Matrix3Component);
    bonusEntities.forEach(bonusEntity => {
      const bonusPixiComponent = bonusEntity.get(PixiComponent);
      const bonusMatrix3Component = bonusEntity.get(Matrix3Component);
      const hypot = Math.hypot(width, height); //NOTE: чтобы не путать других, решил просто взять гипотенузу
      const allPoints = [
        {x: bonusMatrix3Component.x - hypot / 2, y: bonusMatrix3Component.y + hypot / 2},
        {x: bonusMatrix3Component.x + hypot / 2, y: bonusMatrix3Component.y + hypot / 2},
        {x: bonusMatrix3Component.x + hypot / 2, y: bonusMatrix3Component.y - hypot / 2},
        {x: bonusMatrix3Component.x - hypot / 2, y: bonusMatrix3Component.y - hypot / 2}
      ];
      const isInsideViewport = allPoints.some(({x, y}) => {
        const globalX = mainContainerMatrix3Component.x + x;
        const globalY = mainContainerMatrix3Component.y + y;
        return getIsInsideRectangle({x: globalX, y: globalY}, GAME_SIZE);
      });
      bonusPixiComponent.pixiObject.visible = isInsideViewport;
      const positionAfterWhichRemove = characterMatrix3Component.y + GAME_SIZE.height - trackingBoundary;
      const totalPositionAfterWhichRemove = positionAfterWhichRemove + hypot * 2;
      if (totalPositionAfterWhichRemove < bonusMatrix3Component.y)
        bonusEntity.destroy();
    });
  }

  checkOnCollisionWithBonuses({characterEntity}) {
    const characterCollisionComponents = characterEntity.getList(CollisionComponent);
    const characterCollisionWithBonuses = characterCollisionComponents.find(({collisionGroup}) => collisionGroup === CHARACTER_WITH_BONUSES);
    if (characterCollisionWithBonuses)
      characterCollisionWithBonuses.collisionList.forEach(entity => entity.destroy());
  }

  checkOnCollisionWithSpikes({characterEntity}) {
    const characterCollisionComponents = characterEntity.getList(CollisionComponent);
    const characterCollisionWithSpikes = characterCollisionComponents.find(({collisionGroup}) => collisionGroup === CHARACTER_WITH_SPIKES);
    if (characterCollisionWithSpikes)
      characterCollisionWithSpikes.collisionList.forEach(entity => entity.destroy());
  }

  optimizationSpikes({spikeEntities, characterEntity, mainContainerEntity}) {
    const {storage: {mainSceneSettings: {spike: {width, height}, camera: {trackingBoundary}}}} = this;
    const mainContainerMatrix3Component = mainContainerEntity.get(Matrix3Component);
    const characterMatrix3Component = characterEntity.get(Matrix3Component);
    spikeEntities.forEach(spikeEntity => {
      const spikePixiComponent = spikeEntity.get(PixiComponent);
      const spikeMatrix3Component = spikeEntity.get(Matrix3Component);
      const hypot = Math.hypot(width, height); //NOTE: чтобы не путать других, решил просто взять гипотенузу
      const allPoints = [
        {x: spikeMatrix3Component.x - hypot / 2, y: spikeMatrix3Component.y + hypot / 2},
        {x: spikeMatrix3Component.x + hypot / 2, y: spikeMatrix3Component.y + hypot / 2},
        {x: spikeMatrix3Component.x + hypot / 2, y: spikeMatrix3Component.y - hypot / 2},
        {x: spikeMatrix3Component.x - hypot / 2, y: spikeMatrix3Component.y - hypot / 2}
      ];
      const isInsideViewport = allPoints.some(({x, y}) => {
        const globalX = mainContainerMatrix3Component.x + x;
        const globalY = mainContainerMatrix3Component.y + y;
        return getIsInsideRectangle({x: globalX, y: globalY}, GAME_SIZE);
      });
      spikePixiComponent.pixiObject.visible = isInsideViewport;
      const positionAfterWhichRemove = characterMatrix3Component.y + GAME_SIZE.height - trackingBoundary;
      const totalPositionAfterWhichRemove = positionAfterWhichRemove + hypot * 2;
      if (totalPositionAfterWhichRemove < spikeMatrix3Component.y)
        spikeEntity.destroy();
    });
  }

  update() {
    const characterEntity = this.getFirstEntityByType(CHARACTER);
    const mainContainerEntity = this.getFirstEntityByType(MAIN_CONTAINER);
    const roadChunkEntities = this.getEntitiesByType(ROAD_CHUNK).list;
    const bonusEntities = this.getEntitiesByType(BONUS).list;
    const spikeEntities = this.getEntitiesByType(SPIKE).list;
    const fullArguments = {
      characterEntity,
      bonusEntities,
      spikeEntities,
      mainContainerEntity,
      roadChunkEntities,
      arguments
    };
    this.optimizationRoadChunks(fullArguments);
    this.checkOnAddRoadChunks(fullArguments);

    this.optimizationBonuses(fullArguments);
    this.checkOnCollisionWithBonuses(fullArguments);

    this.optimizationSpikes(fullArguments);
    this.checkOnCollisionWithSpikes(fullArguments);
  }
}
