import {BASKETBALL} from "../../constants/game";
import {TWEENS} from "../../constants/tweens";
import {image} from "@shared";

const settings = {
  ease: "sine.inOut",
  duration: 0.4,
  count: 1,
  opacity: {
    start: 0.5,
    end: 0
  },
  scale: {
    start: 1,
    end: 3
  },
  pulseDuration: 0.6,
  delayBetween: 0.2
};

export function x2ViewTween(matrix, targetPosition, bounding, parent, angularVelocity, onComplete) {
  const timeline = gsap.timeline({
    id: TWEENS.x2ViewTween,
    onUpdate() {
      const deltaTime = gsap.ticker.deltaRatio() / 60;
      const addedAngle = deltaTime * THREE.MathUtils.degToRad(angularVelocity);
      matrix.rotation = {
        x: matrix.rotation.x + addedAngle,
        y: matrix.rotation.y + addedAngle,
        z: matrix.rotation.z + addedAngle
      };
    },
    onComplete() {
      onComplete?.();
      this.delete(BASKETBALL);
    }
  }).save(BASKETBALL);

  const {position} = matrix;
  const length = position.clone().sub(targetPosition).length();
  const nodes = createNodes(bounding, parent);
  const xStart = bounding.left + bounding.width / 2;
  const yStart = bounding.top + bounding.height / 2;

  const prevKill = timeline.kill.bind(timeline);
  timeline.kill = kill.bind({prevKill, nodes});

  timeline
  .to(position, {
    x: targetPosition.x,
    y: targetPosition.y,
    z: targetPosition.z,
    ease: settings.ease,
    duration: length * settings.duration
  })
  .set(nodes, {
    x: xStart,
    y: yStart,
    opacity: settings.opacity.start,
    scaleX: settings.scale.start,
    scaleY: settings.scale.start
  }, "<");

  nodes.forEach((node, i) => {
    timeline
    .to(node, {
      opacity: settings.opacity.end,
      scaleX: settings.scale.end, scaleY: settings.scale.end,
      duration: settings.pulseDuration,
      ease: settings.ease
    }, settings.delayBetween * i);
  });

  return timeline;
}

function kill() {
  const {prevKill, nodes} = this;
  prevKill();
  nodes.forEach(node => node.remove());
}

function createNodes(bounding, parent) {
  return Array.from({length: settings.count}).map(() => {
    const node = document.createElement("div");
    gsap.set(node, {
      width: bounding.width,
      height: bounding.height,
      position: "absolute",
      left: `${-bounding.width / 2}px`,
      top: `${-bounding.height / 2}px`,
      transformOrigin: "50% 50%",
      pointerEvents: "none",
      willChange: "transform"
    });

    const img = document.createElement("img");
    img.src = image("widgets/basketball-game/score-stat.png");
    gsap.set(img, {
      draggable: false,
      width: bounding.width,
      height: bounding.height,
      objectFit: "cover"
    });
    node.appendChild(img);

    parent.appendChild(node);

    return node;
  });
}