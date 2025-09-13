export default function getEventPosition(e) {
  return {
    x: e.pageX ?? e.touches?.[0]?.clientX ?? e.detail?.x ?? 0,
    y: e.pageY ?? e.touches?.[0]?.clientY ?? e.detail?.y ?? 0
  };
}


export function getPointerPositionInsideElement(e, elementBounding) {
  const {x, y} = getEventPosition(e);

  const elementX = x - elementBounding.x;
  const elementY = y - elementBounding.y;

  const xPercent = +((elementX / elementBounding.width) * 100).toFixed(0);
  const yPercent = +((elementY / elementBounding.height) * 100).toFixed(0);

  const xPercentString = `${xPercent}%`;
  const yPercentString = `${yPercent}%`;

  const isInsideArea = [elementX, elementY].every(axis => axis >= 0);

  return {
    originX: x, originY: y,
    elementX, elementY,
    isInsideArea,
    xPercent, yPercent,
    xPercentString, yPercentString
  };
}