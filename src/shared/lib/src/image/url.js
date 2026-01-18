import {BASE_URL} from "../../../constants";

export function image(url) {
  return `${BASE_URL}images/${url}`;
}

export function assets(url) {
  return `${BASE_URL}assets/${url}`;
}
