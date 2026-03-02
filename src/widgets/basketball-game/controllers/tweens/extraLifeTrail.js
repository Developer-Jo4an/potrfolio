import {random} from "lodash";
import {createNodes, kill} from "./utils";
import {TWEENS} from "../constants/tweens";
import {BASKETBALL} from "../constants/game";

const settings = {
  src: "widgets/basketball-game/boosters/extra-life.png",
  count: 10,
  vectorLength: 450,
  speed: 350,
  angle: {min: 80, max: 100},
  scale: {start: 1, end: 1.3},
  opacity: {start: 1, end: 0},
  delayBetween: 0.15,
  ease: "sine.inOut",
};

export function extraLifeTrail(bounding, parent) {
  const nodes = createNodes(bounding, settings.count, settings.src, parent);
  const duration = settings.vectorLength / settings.speed;

  const timeline = gsap
    .timeline({
      id: TWEENS.extraLifeTrailTween,
      onComplete() {
        this.delete(BASKETBALL);
      },
    })
    .save(BASKETBALL, TWEENS.extraLifeTrailTween);

  const prevKill = timeline.kill.bind(timeline);
  timeline.kill = kill.bind({prevKill, nodes});

  const xStart = bounding.left + bounding.width / 2;
  const yStart = bounding.top + bounding.height / 2;

  timeline.set(nodes, {
    x: xStart,
    y: yStart,
    opacity: settings.opacity.start,
    scaleX: settings.scale.start,
    scaleY: settings.scale.start,
  });

  nodes.forEach((node, i) => {
    const randomAngle = random(settings.angle.min, settings.angle.max, false) * (Math.PI / 180);
    const x = xStart + Math.cos(randomAngle) * settings.vectorLength;
    const y = yStart - Math.sin(randomAngle) * settings.vectorLength;
    timeline.to(
      node,
      {
        x,
        y,
        opacity: settings.opacity.end,
        scaleX: settings.scale.end,
        scaleY: settings.scale.end,
        duration,
        ease: settings.ease,
      },
      settings.delayBetween * i,
    );
  });

  return timeline;
}
