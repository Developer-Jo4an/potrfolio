export function warn(...params) {
  const message = "THREE." + params.shift();
  console.warn(message, ...params);
}
