import {minBy, maxBy} from "lodash";

export function getPointsFromPolygon(polygon) {
  return polygon.points.map((point) => {
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

export function isPointInPolygon(point, polygon) {
  const {x, y} = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x,
      yi = polygon[i].y;
    const xj = polygon[j].x,
      yj = polygon[j].y;

    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

function segmentsIntersect(p1, p2, p3, p4) {
  const d1 = cross(p1, p2, p3);
  const d2 = cross(p1, p2, p4);
  const d3 = cross(p3, p4, p1);
  const d4 = cross(p3, p4, p2);

  return d1 * d2 < 0 && d3 * d4 < 0;
}

function cross(a, b, c) {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

function hasEdgeIntersection(poly1, poly2) {
  for (let i = 0; i < poly1.length; i++) {
    const a1 = poly1[i];
    const a2 = poly1[(i + 1) % poly1.length];

    for (let j = 0; j < poly2.length; j++) {
      const b1 = poly2[j];
      const b2 = poly2[(j + 1) % poly2.length];

      if (segmentsIntersect(a1, a2, b1, b2)) {
        return true;
      }
    }
  }
  return false;
}

export function isPolygonFullyInside(inner, outer) {
  if (!inner.every((p) => isPointInPolygon(p, outer))) return false;
  return !hasEdgeIntersection(inner, outer);
}
