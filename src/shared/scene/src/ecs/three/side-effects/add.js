export const ADD = "add";
export function add(parent, ...children) {
  parent.add(...children);
  return () => children.forEach((child) => parent.remove(child));
}
