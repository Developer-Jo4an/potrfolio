export function createId() {
  let id = 0;
  return () => id++;
}