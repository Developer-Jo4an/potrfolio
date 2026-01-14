export default function getEventPosition(e) {
  const x = e?.pageX ?? e.touches?.[0]?.clientX ?? e.changedTouches?.[0]?.clientX ?? e.detail?.x ?? 0;
  const y = e?.pageY ?? e.touches?.[0]?.clientY ?? e.changedTouches?.[0]?.clientY ?? e.detail?.y ?? 0;

  const normalizedX = (x / global.innerWidth) * 2 - 1;
  const normalizedY = -(y / global.innerHeight) * 2 + 1;

  return {
    x, y,
    normalizedX,
    normalizedY,
    fromScreenX: x / global.innerWidth,
    fromScreenY: y / global.innerHeight
  };
}