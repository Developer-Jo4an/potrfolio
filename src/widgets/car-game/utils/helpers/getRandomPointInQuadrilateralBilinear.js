export function getRandomPointInQuadrilateralBilinear(
  startPointFirst,
  startPointSecond,
  endPointFirst,
  endPointSecond,
) {
  const u = Math.random();
  const v = Math.random();
  const bottom = {
    x: startPointFirst.x + u * (startPointSecond.x - startPointFirst.x),
    y: startPointFirst.y + u * (startPointSecond.y - startPointFirst.y),
  };
  const top = {
    x: endPointFirst.x + u * (endPointSecond.x - endPointFirst.x),
    y: endPointFirst.y + u * (endPointSecond.y - endPointFirst.y),
  };
  const x = bottom.x + v * (top.x - bottom.x);
  const y = bottom.y + v * (top.y - bottom.y);
  return {x, y};
}
