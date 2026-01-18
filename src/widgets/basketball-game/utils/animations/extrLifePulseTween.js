import {image} from "../../../../shared/lib/src/image/url";
import gsap from "gsap";
import {TWEENS} from "../../constants/tweens";
import {BASKETBALL} from "../../constants/game";

const settings = {
  count: 10,
  opacity: {
    start: 0.5,
    end: 0
  },
  scale: {
    start: 1,
    end: 4
  },
  duration: 1,
  delayBetween: 0.2,
  ease: "sine.inOut"
};

export default function extraLifePulseTween(bounding, parent) {
  const nodes = createNodes(bounding, parent);

  const timeline = gsap.timeline({
    id: TWEENS.extraLifePulseTween,
    onComplete() {
      this.delete(BASKETBALL);
    }
  }).save(BASKETBALL, TWEENS.extraLifePulseTween);

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
    timeline
    .to(node, {
      opacity: settings.opacity.end,
      scaleX: settings.scale.end, scaleY: settings.scale.end,
      duration: settings.duration,
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