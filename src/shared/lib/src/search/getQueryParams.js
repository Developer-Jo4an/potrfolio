export function getQueryParams(search) {
  const params = new URLSearchParams(search);
  const result = {};
  for (const [key, value] of params) result[key] = value;
  return result;
}
