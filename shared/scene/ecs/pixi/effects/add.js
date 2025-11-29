export default function add(parent, ...children) {

  parent.addChild(...children);

  return () => {
    for (const child of children) {
      if (!child) continue;
      if (child.parent) child.parent.removeChild(child);
    }
  };
}
