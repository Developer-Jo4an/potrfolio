import {Generator} from "./Generator";
import {Entity, lerpArray, randFromArray} from "@shared";
import {ROAD_CHUNK} from "../../constants/entities";
import {GAME_SIZE} from "../../constants/game";

export class RoadChunk extends Generator {
  generate() {
    const {eventBus} = this;

    const eRoadChunk = new Entity({eventBus, type: ROAD_CHUNK}).init();

    this.initMatrix(eRoadChunk, ...arguments);
    this.initPolygon(eRoadChunk, ...arguments);
    this.initView(eRoadChunk, ...arguments);

    return eRoadChunk;
  }

  initMatrix(eRoadChunk) {
    const {system} = this;
    const prevRoadChunk = this.getRoadChunkByIndex(-2);
    const {cMatrix: cCurrentMatrix} = system.getRoadChunkInfo(eRoadChunk);

    if (!prevRoadChunk) {
      cCurrentMatrix.x = GAME_SIZE.width / 2;
      cCurrentMatrix.y = GAME_SIZE.height;
    } else {
      const {cMatrix: cPrevMatrix} = system.getRoadChunkInfo(prevRoadChunk);
      cCurrentMatrix.x = GAME_SIZE.width / 2;
      cCurrentMatrix.y = cPrevMatrix.y - cPrevMatrix.height;
    }
  }

  initPolygon(eRoadChunk) {
    const {system} = this;
    const {
      cPolygon,
      settings: {angle, length, size},
    } = system.getRoadChunkInfo(eRoadChunk);

    const prevRoadChunk = this.getRoadChunkByIndex(-2);

    if (!prevRoadChunk) {
      const startSize = lerpArray(size);
      const endSize = lerpArray(size);

      const chunkLength = lerpArray(length);
      const chunkAngle = randFromArray(angle);

      const xStart = GAME_SIZE.width / 2;
      const yStart = GAME_SIZE.height;
      const xEnd = xStart + Math.cos(chunkAngle) * chunkLength;
      const yEnd = yStart - Math.sin(chunkAngle) * chunkLength;

      cPolygon.angle = chunkAngle;

      cPolygon.polygon = new PIXI.Polygon([
        new PIXI.Point(xStart - startSize / 2, yStart),
        new PIXI.Point(xStart, yStart),
        new PIXI.Point(xStart + startSize / 2, yStart),
        new PIXI.Point(xEnd + endSize / 2, yEnd),
        new PIXI.Point(xEnd, yEnd),
        new PIXI.Point(xEnd - endSize / 2, yEnd),
      ]);
    }
  }

  initView(eRoadChunk) {
    const {system} = this;
    const {
      cPixi,
      cMatrix,
      settings: {angle, length, size, tileScale},
    } = system.getRoadChunkInfo(eRoadChunk);

    const asset = (cPixi.pixiObject = system.getAsset(eRoadChunk, ROAD_CHUNK));

    asset.width = Math.abs(Math.cos(angle[0]) * length[1]) + Math.abs(Math.cos(angle[1]) * length[1]) + size[1];
    asset.height = Math.abs(Math.sin(angle[0]) * length[1]) + Math.abs(Math.sin(angle[1]) * length[1]);

    asset.tileScale.set(tileScale);
    asset.applyAnchorToTexture = true;

    asset.x = cMatrix.x;
    asset.y = cMatrix.y;
  }

  getRoadChunkByIndex(index) {
    const {roadChunks} = this;
    return index >= 0 ? roadChunks[index] : roadChunks[roadChunks.length + index];
  }

  get roadChunks() {
    return this.system.getEntitiesByType(ROAD_CHUNK)?.list ?? [];
  }
}
