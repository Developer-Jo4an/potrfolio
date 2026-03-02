import {TWEENS} from "../constants/tweens";
import {BASKETBALL} from "../constants/game";
import {createNodes, kill} from "./utils";

const settings = {
  count: 10,
  opacity: {start: 0.5, end: 0},
  scale: {start: 1, end: 4},
  duration: 1,
  delayBetween: 0.2,
  src: "widgets/basketball-game/boosters/extra-life.png",
  ease: "sine.inOut",
};

export function extraLifePulse(bounding, parent) {
  const nodes = createNodes(bounding, settings.count, settings.src, parent);

  const timeline = gsap
    .timeline({
      id: TWEENS.extraLifePulseTween,
      onComplete() {
        this.delete(BASKETBALL);
      },
    })
    .save(BASKETBALL, TWEENS.extraLifePulseTween);

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
    timeline.to(
      node,
      {
        opacity: settings.opacity.end,
        scaleX: settings.scale.end,
        scaleY: settings.scale.end,
        duration: settings.duration,
        ease: settings.ease,
      },
      settings.delayBetween * i,
    );
  });

  return timeline;
}
