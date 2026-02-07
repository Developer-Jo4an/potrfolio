import {Tween} from "../Tween";
import {playAnimationOnce} from "@shared";

export class ChangeBlocked extends Tween {
  constructor() {
    super(...arguments);

    this.init();
  }

  init() {
    super.init();

    const {
      vars: {animateObject, isBlocked}
    } = this;

    animateObject.alpha = 1;

    playAnimationOnce({spine: animateObject, name: "explosion", reverse: isBlocked}).then(async () => {
      if (isBlocked) {
        await playAnimationOnce({spine: animateObject, name: "explosion_1", reverse: isBlocked});
        playAnimationOnce({spine: animateObject, name: "idle_1", pause: true});
      }

      animateObject.alpha = +isBlocked;

      this.resolve();
    });
  }
}
