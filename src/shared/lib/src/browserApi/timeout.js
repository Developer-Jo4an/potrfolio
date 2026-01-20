export function createTimeout(func, delay) {
  const timeoutId = setTimeout(func, delay);
  return () => clearTimeout(timeoutId);
}
