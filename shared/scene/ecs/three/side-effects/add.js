export const ADD = "add";
export default function add(object, to) {
  to.add(object);
  return () => to.remove(object);
}