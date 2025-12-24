import gsap from "gsap";
import {TWEENS} from "../../constants/tweens";

export default function teleportActorToInitialPositionTween(mesh, afterHide) {
  const timeline = gsap.timeline({id: TWEENS.teleportOnInitialPosition});

  return timeline
  .to(mesh.material, {
    opacity: 0,
    ease: "sine.in",
    duration: 0.3,
    onComplete() {
      afterHide();
    }
  })
  .to(mesh.material, {
    opacity: 1,
    ease: "sine.out",
    duration: 0.1
  });
}