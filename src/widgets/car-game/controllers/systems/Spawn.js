import {System, initPlugins, generate} from "@shared";
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

  checkSpawnRoad() {
    const {plugins} = this;

    const isNeedSpawn = this.getIsNeedSpawn();
    if (!isNeedSpawn) return;

    const eRoadChunk = generate(ROAD_CHUNK, plugins, ...arguments);
    const {view: roadChunkView} = this.getRoadChunkInfo(eRoadChunk);

    const {view: roadChunkContainer} = this.getRoadChunksContainerInfo();
    roadChunkContainer.addChild(roadChunkView);

    this.updateMask();
  }

  getIsNeedSpawn() {
    const roadChunks = this.getRoadChunks();
    if (!roadChunks.length) return true;

    const eLastRoadChunk = this.getRoadChunkByIndex(-1);
    const {
      cPolygon: {xEnd, yEnd},
    } = this.getRoadChunkInfo(eLastRoadChunk);

    const {view: roadChunksContainerView} = this.getRoadChunksContainerInfo();

    const position = roadChunksContainerView.toGlobal({x: xEnd, y: yEnd}, undefined, true);
    return position.y > 0;
  }

  checkDeleteRoad() {
    const roadChunks = this.getRoadChunks();
    const {view: roadChunksContainerView} = this.getRoadChunksContainerInfo();

    const removeEntities = roadChunks.filter((eRoadChunk) => {
      const {
        cPolygon: {xEnd, yEnd},
      } = this.getRoadChunkInfo(eRoadChunk);

      const position = roadChunksContainerView.toGlobal({x: xEnd, y: yEnd}, undefined, true);

      return position.y > global.innerHeight;
    });

    removeEntities.forEach((eRoadChunk) => eRoadChunk.destroy());

    this.updateMask();
  }

  updateMask() {
    const {view: roadChunkContainer} = this.getRoadChunksContainerInfo();
    const roadChunks = this.getRoadChunks();

    if (!roadChunkContainer.mask) {
      const mask = (roadChunkContainer.mask = new PIXI.Graphics());
      roadChunkContainer.addChild(mask);
    }

    roadChunkContainer.mask.clear();

    this.drawMask(roadChunks, [0, 1, 4, 5, 6, 7], false);
    this.drawMask([...roadChunks].reverse(), [10, 11, 0, 1], true);

    roadChunkContainer.mask.closePath().fill(0xffffff);
  }

  drawMask(roadChunks, [x0, y0, x1, y1, x2, y2], isReversed) {
    const {
      view: {mask},
    } = this.getRoadChunksContainerInfo();

    roadChunks.forEach((eRoadChunk, index) => {
      const {
        cPolygon: {
          polygon: {points},
        },
      } = this.getRoadChunkInfo(eRoadChunk);

      if (!isReversed) {
        if (!index) mask.moveTo(points[x0], points[y0]).lineTo(points[x1], points[y1]).lineTo(points[x2], points[y2]);
        else mask.lineTo(points[x2], points[y2]);
      } else {
        if (!index) mask.lineTo(points[x0], points[y0]).lineTo(points[x1], points[y1]);
        else mask.lineTo(points[x1], points[y1]);
      }
    });
  }

  update() {
    this.checkSpawnRoad(...arguments);
    this.checkDeleteRoad(...arguments);
  }
}
