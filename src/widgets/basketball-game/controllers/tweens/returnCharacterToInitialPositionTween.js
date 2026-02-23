import {TWEENS} from "../constants/tweens";
import {BASKETBALL} from "../constants/game";

const settings = {speed: 3};

export function returnCharacterToInitialPositionTween(body, target) {
  const {x, y, z} = body.translation();
  const proxy = {x, y, z};

  const vec3 = new THREE.Vector3();
  vec3.set(target.x - x, target.y - y, target.z - z);
  const duration = vec3.length() / settings.speed;

  return gsap
    .to(proxy, {
      ...target,
      id: TWEENS.returnOnInitialPosition,
      ease: "sine.inOut",
      duration,
      onUpdate() {
        const {x, y, z} = proxy;
        body.setTranslation({x, y, z});
      },
      onComplete() {
        this.delete(BASKETBALL);
      },
    })
    .save(BASKETBALL, TWEENS.returnOnInitialPosition);
}
