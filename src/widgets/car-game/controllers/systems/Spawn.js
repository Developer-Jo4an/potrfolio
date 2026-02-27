import {System, initPlugins, getPlugin} from "@shared";
import {RoadChunk} from "../plugins/generators/RoadChunk";
import {ROAD_CHUNK} from "../constants/entities";

export class Spawn extends System {
  init() {
    this.initPlugins();
  }

  initPlugins() {
    const {
      eventBus,
      storage,
      storage: {engine},
    } = this;

    initPlugins(this, [[ROAD_CHUNK, RoadChunk]], {
      eventBus,
      storage,
      system: this,
      engine,
    });
  }

  initializationLevelSelect() {}

  checkSpawnRoad() {
    const isNeedSpawn = this.getIsNeedSpawn();
    if (!isNeedSpawn) return;

    const eRoadChunk = this.spawnEntity(ROAD_CHUNK);
    const {view: roadChunkView} = this.getRoadChunkInfo(eRoadChunk);

    const {view: roadChunkContainer} = this.getRoadChunksContainerInfo();
    roadChunkContainer.addChild(roadChunkView);

    this.updateMask();
  }

  updateMask() {
    const {view: roadChunkContainer} = this.getRoadChunksContainerInfo();
    const roadChunks = this.getEntitiesByType(ROAD_CHUNK).list;

    if (!roadChunkContainer.mask) {
      const mask = (roadChunkContainer.mask = new PIXI.Graphics());
      roadChunkContainer.addChild(mask);
    }

    const {mask} = roadChunkContainer;
    mask.clear();

    this.drawMask(roadChunks, [0, 1, 4, 5, 6, 7]);
    this.drawMask([...roadChunks].reverse(), [6, 7, 10, 11, 0, 1]);

    mask.closePath().fill(0xffffff);
  }

  drawMask(roadChunks, pointIndexes) {
    const {view: roadChunkContainer} = this.getRoadChunksContainerInfo();
    const {mask} = roadChunkContainer;

    roadChunks.forEach((eRoadChunk, index) => {
      const {cPolygon} = this.getRoadChunkInfo(eRoadChunk);
      const {
        polygon: {points},
      } = cPolygon;

      const [x0, y0, x1, y1, x2, y2] = pointIndexes;

      if (!index) {
        mask.moveTo(points[x0], points[y0]).lineTo(points[x1], points[y1]).lineTo(points[x2], points[y2]);
        return;
      }

      mask.lineTo(points[x2], points[y2]);
    });
  }

  spawnEntity(type, ...args) {
    const {plugins} = this;
    const plugin = getPlugin(type, plugins);
    return plugin.generate(...args);
  }

  getIsNeedSpawn() {
    const roadChunks = this.getEntitiesByType(ROAD_CHUNK)?.list ?? [];
    return !roadChunks.length;
  }

  update() {
    this.checkSpawnRoad(...arguments);
  }
}
