export default function dataAttrs(data) {
  const attrs = {};
  for (const key in data)
    attrs[`data-${key}`] = data[key];
  return attrs;
}