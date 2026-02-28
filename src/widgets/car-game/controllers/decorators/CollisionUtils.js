import {Utils} from "./Utils";
import {SatCollider} from "@shared";

export class CollisionUtils extends Utils {
  createCollider(x, y, width, height) {
    const position = new SAT.Vector(x - width / 2, y - height / 2);

    const halfWidth = width / 2;
    const halfHeight = height / 2;

    const points = [
      new SAT.Vector(-halfWidth, halfHeight),
      new SAT.Vector(halfWidth, halfHeight),
      new SAT.Vector(halfWidth, -halfHeight),
      new SAT.Vector(-halfWidth, -halfHeight),
    ];

    return new SAT.Polygon(position, points);
  }

  createColliderFromPoints(x, y, points) {
    const position = new SAT.Vector(x, y);
    const polygonPoints = points.map(({x, y}) => new SAT.Vector(x, y));
    return new SAT.Polygon(position, polygonPoints);
  }

  runOnCollisions(entity, group, callback) {
    const {isTrackCollision, response} = entity.get(SatCollider);

    if (!isTrackCollision) return;

    const collisionData = response[group];
    if (!collisionData) return;

    for (const uuid in collisionData) {
      const {isCollided} = collisionData[uuid];
      if (isCollided) {
        const result = callback?.(uuid);
        if (result === true) break;
      }
    }
  }
}
