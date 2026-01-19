import {image} from "@shared";
import {random} from "lodash";
import {TWEENS} from "../../constants/tweens";
import {BASKETBALL} from "../../constants/game";

const settings = {
  count: 10,
  vectorLength: 450,
  speed: 350,
  angle: {
    min: 80,
    max: 100
  },
  scale: {
    start: 1,
    end: 1.3
  },
  opacity: {
    start: 1,
    end: 0
  },
  delayBetween: 0.15,
  ease: "sine.inOut"
};

export function extraLifeTrailTween(bounding, parent) {
  const nodes = createNodes(bounding, parent);
  const duration = settings.vectorLength / settings.speed;

  const timeline = gsap.timeline({
    id: TWEENS.extraLifeTrailTween,
    onComplete() {
      this.delete(BASKETBALL);
    }
  }).save(BASKETBALL, TWEENS.extraLifeTrailTween);

  const prevKill = timeline.kill.bind(timeline);
  timeline.kill = kill.bind({prevKill, nodes});

  const xStart = bounding.left + bounding.width / 2;
  const yStart = bounding.top + bounding.height / 2;

  timeline
  .set(nodes, {
    x: xStart,
    y: yStart,
    opacity: settings.opacity.start,
    scaleX: settings.scale.start,
    scaleY: settings.scale.start
  });

  nodes.forEach((node, i) => {
    const randomAngle = random(settings.angle.min, settings.angle.max, false) * (Math.PI / 180);
    const x = xStart + Math.cos(randomAngle) * settings.vectorLength;
    const y = yStart - Math.sin(randomAngle) * settings.vectorLength;
    timeline
    .to(node, {
      x, y,
      opacity: settings.opacity.end,
      scaleX: settings.scale.end, scaleY: settings.scale.end,
      duration,
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
    img.src = image("widgets/basketball-game/extraLifeBooster.png");
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