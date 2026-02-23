import {minBy, maxBy} from "lodash";

export function getPointsFromPolygon(polygon) {
  return polygon.points.map(point => {
    const cos = Math.cos(polygon.angle);
    const sin = Math.sin(polygon.angle);

    const x = point.x * cos - point.y * sin;
    const y = point.x * sin + point.y * cos;

    return {
      x: x + polygon.pos.x + polygon.offset.x,
      y: y + polygon.pos.y + polygon.offset.y,
    };
  });
}

export function getBoundsFromPolygon(polygon) {
  const points = getPointsFromPolygon(polygon);

  const minX = minBy(points, "x").x;
  const maxX = maxBy(points, "x").x;
  const minY = minBy(points, "y").y;
  const maxY = maxBy(points, "y").y;

  return {minX, maxX, minY, maxY};
}
