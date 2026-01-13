export const ADD = "add";
export default function add(parent, ...children) {
  parent.add(...children);
  return () => children.forEach(child => parent.remove(child));
}