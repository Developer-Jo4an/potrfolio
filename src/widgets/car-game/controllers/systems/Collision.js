import {getPointsFromPolygon, isPointInPolygon, System} from "@shared";

export class Collision extends System {
  checkCollision() {
    const {
      cCollider: {collider},
    } = this.getActorInfo();

    const allRoadChunksVertices = this.calculateMergedPolygon();
    const fronPoints = getPointsFromPolygon(collider).slice(2);

    const isOnRoad = fronPoints.every((point) => isPointInPolygon(point, allRoadChunksVertices));

    if (!isOnRoad) {
      ;
    }
  }

  calculateMergedPolygon() {
    const roadChunks = this.getRoadChunks();

    const halfVertices1 = this.calculatePoints(roadChunks, [0, 1, 4, 5, 6, 7], false);
    const halfVertices2 = this.calculatePoints([...roadChunks].reverse(), [10, 11, 0, 1], true);

    return [...halfVertices1, ...halfVertices2];
  }

  calculatePoints(roadChunks, [x0, y0, x1, y1, x2, y2], isReversed) {
    return roadChunks.reduce((acc, eRoadChunk, index, {length}) => {
      const {
        cPolygon: {
          polygon: {points},
        },
      } = this.getRoadChunkInfo(eRoadChunk);

      if (!isReversed) {
        if (!index)
          acc.push({x: points[x0], y: points[y0]}, {x: points[x1], y: points[y1]}, {x: points[x2], y: points[y2]});
        else acc.push({x: points[x2], y: points[y2]});
      } else {
        if (index === length - 1) return acc;
        if (!index) acc.push({x: points[x0], y: points[y0]}, {x: points[x1], y: points[y1]});
        else acc.push({x: points[x1], y: points[y1]});
      }

      return acc;
    }, []);
  }

  update() {
    this.checkCollision(...arguments);
  }
}
