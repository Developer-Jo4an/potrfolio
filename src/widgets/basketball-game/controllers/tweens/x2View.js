import {BASKETBALL} from "../constants/game";
import {TWEENS} from "../constants/tweens";
import {createNodes, kill} from "./utils";

const settings = {
  src: "widgets/basketball-game/stats/score.png",
  ease: "sine.inOut",
  duration: 0.4,
  count: 1,
  opacity: {start: 0.5, end: 0},
  scale: {start: 1, end: 3},
  pulseDuration: 0.6,
  delayBetween: 0.2,
};

export function x2View(matrix, targetPosition, bounding, parent, angularVelocity, onComplete) {
  const timeline = gsap
    .timeline({
      id: TWEENS.x2ViewTween,
      onUpdate() {
        const deltaTime = gsap.ticker.deltaRatio() / 60;
        const addedAngle = deltaTime * THREE.MathUtils.degToRad(angularVelocity);
        matrix.rotation = {
          x: matrix.rotation.x + addedAngle,
          y: matrix.rotation.y + addedAngle,
          z: matrix.rotation.z + addedAngle,
        };
      },
      onComplete() {
        onComplete?.();
        this.delete(BASKETBALL);
      },
    })
    .save(BASKETBALL);

  const {position} = matrix;
  const length = position.clone().sub(targetPosition).length();
  const nodes = createNodes(bounding, settings.count, settings.src, parent);
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
      duration: length * settings.duration,
    })
    .set(
      nodes,
      {
        x: xStart,
        y: yStart,
        opacity: settings.opacity.start,
        scaleX: settings.scale.start,
        scaleY: settings.scale.start,
      },
      "<",
    );

  nodes.forEach((node, i) => {
    timeline.to(
      node,
      {
        opacity: settings.opacity.end,
        scaleX: settings.scale.end,
        scaleY: settings.scale.end,
        duration: settings.pulseDuration,
        ease: settings.ease,
      },
      settings.delayBetween * i,
    );
  });

  return timeline;
}
