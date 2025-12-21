import gsap from "gsap";
import {BASKETBALL} from "../../constants/game";

export default function returnCharacterOnInitialPosition(body, target) {
  const {x, y, z} = body.translation();
  const proxy = {x, y, z};

  const tween = gsap.to(proxy, {
    ...target,
    ease: "sine.inOut",
    duration: 0.2,
    onUpdate() {
      const {x, y, z} = proxy;
      body.setTranslation({x, y, z});
    }
  });

  return new Promise(res => {
    tween.eventCallback("onComplete", () => {
      tween.delete(BASKETBALL);
      res();
    });
  });
}