export default function getIsInsideRectangle(
  {x: pointX = 0, y: pointY = 0} = {},
  {x = 0, y = 0, width = 0, height = 0} = {}
) {
  return (
    pointX >= x && pointX <= x + width
    &&
    pointY >= y && pointY <= y + height
  );
}
