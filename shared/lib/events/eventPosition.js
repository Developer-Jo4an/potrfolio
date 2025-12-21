export default function getEventPosition(e) {
  const x = e?.pageX ?? e.touches?.[0]?.clientX ?? e.changedTouches?.[0]?.clientX ?? e.detail?.x ?? 0;
  const y = e?.pageY ?? e.touches?.[0]?.clientY ?? e.changedTouches?.[0]?.clientY ?? e.detail?.y ?? 0;

  const normalizedX = (x / global.innerWidth) * 2 - 1;
  const normalizedY = -(y / global.innerHeight) * 2 + 1;

  return {
    x, y,
    normalizedX, normalizedY
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