//canvas должен быть во всю ширину и высоту экрана, иначе придется вызывать getBoundingClientRect, а это дорого
export default function getIsInsideCanvas(bounds, canvas) {
  return !(
    bounds.minX > canvas.offsetWidth
    ||
    bounds.maxX < 0
    ||
    bounds.minY > canvas.offsetHeight
    ||
    bounds.maxY < 0
  );
}