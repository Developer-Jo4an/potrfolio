import gsap from "gsap";
import {BASKETBALL} from "../../constants/game";

export default function returnCharacterOnInitialPosition(body, target) {
  const {x, y, z} = body.translation();
  const proxy = {x, y, z};

  return new Promise(res => {
    const tween = gsap.to(proxy, {
      ...target,
      ease: "sine.inOut",
      duration: 0.5,
      onUpdate() {
        body.setTranslation(proxy);
      },
      onComplete() {
        tween.delete(BASKETBALL);
        res();
      }
    });
  });
}