import {image} from "@shared";

export function createNodes(bounding, length, src, parent) {
  return Array.from({length}).map(() => {
    const node = document.createElement("div");

    gsap.set(node, {
      width: bounding.width,
      height: bounding.height,
      position: "absolute",
      left: `${-bounding.width / 2}px`,
      top: `${-bounding.height / 2}px`,
      transformOrigin: "50% 50%",
      pointerEvents: "none",
      willChange: "transform",
    });

    const img = document.createElement("img");
    img.src = image(src);
    gsap.set(img, {draggable: false, width: bounding.width, height: bounding.height, objectFit: "cover"});
    node.appendChild(img);

    parent.appendChild(node);

    return node;
  });
}

export function kill() {
  const {prevKill, nodes} = this;
  prevKill();
  nodes.forEach((node) => node.remove());
}
