import gsap from "gsap";
import {BASKETBALL} from "../../constants/game";
import {TWEENS} from "../../constants/tweens";

export default function x2ViewTween(object, matrix, camera, target, onComplete) {
  const timeline = gsap.timeline({
    id: TWEENS.x2ViewTween, onComplete() {
      onComplete?.();
      this.delete(BASKETBALL);
    }
  }).save(BASKETBALL);

  const {position} = matrix;

  const length = position.clone().sub(target).length();

  timeline
  .to(position, {x: target.x, y: target.y, z: target.z, ease: "sine.inOut", duration: 0.4})
  // .to(scale, {x: 0, y: 0, z: 0, ease: "sine.inOut", duration: 0.4}, "<");

  return timeline;
}
