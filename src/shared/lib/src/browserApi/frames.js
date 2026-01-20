export function createAnimationFrame(callback) {
  const requestId = requestAnimationFrame(callback);
  return () => cancelAnimationFrame(requestId);
}
