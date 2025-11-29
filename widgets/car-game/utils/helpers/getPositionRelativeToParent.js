export default function getPositionRelativeToParent(child, parent) {
  let x = child.x;
  let y = child.y;
  let current = child.parent;

  while (!!current && current !== parent) {
    x += current.x;
    y += current.y;
    current = current.parent;
  }

  if (current !== parent)
    throw new Error("Parent not found in hierarchy");

  return {x, y};
}

