export function isInsideRectangle(rectangle, x, y) {
  return (
    x >= rectangle.x && x <= rectangle.x + rectangle.width && y >= rectangle.y && y <= rectangle.y + rectangle.height
  );
}

export function distance(p0, p1) {
  return Math.sqrt((p1[0] - p0[0]) ** 2 + (p1[1] - p0[1]) ** 2);
}

export function angle(p0, p1) {
  return Math.atan2(p1[1] - p0[1], p1[0] - p0[0]);
}

export function velocity(x, y) {
  return Math.sqrt(x ** 2 + y ** 2);
}

export function findClosestNumber(target, ...rest) {
  if (rest.length === 0) return target;

  let closest = rest[0];
  let minDiff = Math.abs(target - closest);

  for (const num of rest) {
    const currentDiff = Math.abs(target - num);
    if (currentDiff < minDiff) {
      minDiff = currentDiff;
      closest = num;
    }
  }

  return closest;
}

export function toRad(degrees) {
  return (degrees * Math.PI) / 180;
}
