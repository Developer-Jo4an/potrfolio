import {lerp} from "../math/MathUtils";

/**
 * возвращает случайное число >= min и < max
 * @param {number?} min
 * @param {number} max
 * @return {number}
 */
export function rand(min, max) {
  if (arguments.length === 1) {
    max = min;
    min = 0;
  }

  return lerp(min, max, Math.random());
}

/**
 * возвращает случайное целое число >= min и < max
 * @param {number?} min
 * @param {number} max
 * @return {number}
 */
export function randInteger(min, max) {
  return rand.apply(this, arguments) | 0;
}

/**
 * Возвращает случайный элемент массива
 * @param {Array} arr
 * @return {*}
 */
export function randFromArray(arr) {
  return arr[randInteger(arr.length)];
}

/**
 * Возвращает случайный элемент взвешенного массива, у каждого элемента должен быть параметр `weight`
 * вероятность выпадения конкретного элемента равен его весу разделенному на общий вес всех элементов
 * @param {{weight:number}[]} arr
 * @return {*}
 */
export function randFromWeightedArray(arr) {
  const {total, map} = arr.reduce(initWeights, {total: 0, map: []});

  if (total === 0) {
    return randFromArray(arr);
  }

  const r = rand(total);
  let i = 0;
  while (r >= map[i]) {
    i++;
  }
  return arr[i];

  function initWeights(res, {weight}) {
    res.map.push((res.total += weight));
    return res;
  }
}


