export function createInterval(func, delay) {
  const intervalId = setInterval(func, delay);
  return () => clearInterval(intervalId);
}
