export function createArrayWithMap(count, func) {
  return new Array(count ?? 0).fill(0).map(func);
}
