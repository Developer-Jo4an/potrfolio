function clipInput(k, arr) {
  if (k < 0) k = 0;
  if (k > arr.length - 1) k = arr.length - 1;

  return arr[k];
}

function getTangent(k, factor, array) {
  return (factor * (clipInput(k + 1, array) - clipInput(k - 1, array))) / 2;
}

export function cubicInterpolation(array, t, tangentFactor = 1) {
  const k = Math.floor(t);
  const m = [getTangent(k, tangentFactor, array), getTangent(k + 1, tangentFactor, array)];
  const p = [clipInput(k, array), clipInput(k + 1, array)];

  t -= k;
  const t2 = t * t;
  const t3 = t * t2;

  return (2 * t3 - 3 * t2 + 1) * p[0] + (t3 - 2 * t2 + t) * m[0] + (-2 * t3 + 3 * t2) * p[1] + (t3 - t2) * m[1];
}
