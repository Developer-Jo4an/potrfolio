export function encode(message) {
  return btoa(encodeURIComponent(message));
}

export function decode(message) {
  return decodeURIComponent(atob(message));
}
