import {Generator} from "./Generator";
import {Entity, lerpArray, randFromArray} from "@shared";
import {chunk, cloneDeep} from "lodash";
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
    const ePrevRoadChunk = system.getRoadChunkByIndex(-2);
    const {cMatrix: cCurrentMatrix} = system.getRoadChunkInfo(eRoadChunk);

    if (!ePrevRoadChunk) {
      cCurrentMatrix.x = GAME_SIZE.width / 2;
      cCurrentMatrix.y = GAME_SIZE.height;
    } else {
      const {
        cPolygon: {yEnd},
      } = system.getRoadChunkInfo(ePrevRoadChunk);
      cCurrentMatrix.x = GAME_SIZE.width / 2;
      cCurrentMatrix.y = yEnd;
    }
  }

  initPolygon(eRoadChunk) {
    const {system} = this;
    const {cPolygon} = system.getRoadChunkInfo(eRoadChunk);

    const polygonData = this.calculatePolygonData(eRoadChunk);
    for (const key in polygonData) cPolygon[key] = polygonData[key];
  }

  calculatePolygonData(eRoadChunk) {
    const {system} = this;
    const {
      cPolygon,
      settings: {angle: directionAngle, length: chunkLength, size},
    } = system.getRoadChunkInfo(eRoadChunk);

    const ePrevRoadChunk = system.getRoadChunkByIndex(-2);

    let startSize;
    let endSize;
    let length;
    let angle;
    let xStart;
    let yStart;
    let xEnd;
    let yEnd;

    if (!ePrevRoadChunk) {
      startSize = lerpArray(size);
      endSize = lerpArray(size);

      length = lerpArray(chunkLength);
      angle = randFromArray(directionAngle);

      xStart = GAME_SIZE.width / 2;
      yStart = GAME_SIZE.height;

      xEnd = xStart + Math.cos(angle) * length;
      yEnd = yStart - Math.sin(angle) * length;
    } else {
      const {cPolygon: cPrevPolygon} = system.getRoadChunkInfo(ePrevRoadChunk);

      startSize = cloneDeep(cPrevPolygon.endSize);
      endSize = lerpArray(size);

      length = cPolygon.length = lerpArray(chunkLength);
      angle = cPrevPolygon.angle === directionAngle[0] ? directionAngle[1] : directionAngle[0];

      xStart = cPrevPolygon.xEnd;
      yStart = cPrevPolygon.yEnd;

      xEnd = xStart + Math.cos(angle) * length;
      yEnd = yStart - Math.sin(angle) * length;
    }

    const polygon = this.createPolygon(
      xStart - startSize / 2,
      yStart,
      xStart,
      yStart,
      xStart + startSize / 2,
      yStart,
      xEnd + endSize / 2,
      yEnd,
      xEnd,
      yEnd,
      xEnd - endSize / 2,
      yEnd,
    );

    return {polygon, startSize, endSize, length, angle, xStart, yStart, xEnd, yEnd};
  }

  createPolygon(...points) {
    return new PIXI.Polygon(chunk(points, 2).map(([x, y]) => new PIXI.Point(x, y)));
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
}
