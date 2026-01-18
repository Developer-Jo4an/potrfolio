export function createProxyObject(object, ...fields) {
  const proxyObject = {};

  fields.forEach(field => {
    Object.defineProperty(proxyObject, field, {
      get() {
        return object[field];
      },
      set(value) {
        object[field] = value;
      }
    });
  });

  return proxyObject;
}