import {Tween} from "../Tween";
import {GAME} from "../../../constants/game";

export class ChangeTint extends Tween {
  constructor() {
    super(...arguments);

    this.init();
  }

  init() {
    super.init();

    const {
      vars: {animateObject, tint},
    } = this;

    const tween = (this.tween = gsap
      .timeline({
        onComplete: () => {
          this.resolve();
          tween.delete(GAME);
        },
      })
      .save(GAME));

    tween.to(animateObject, {
      pixi: {tint: tint},
      ease: "sine.inOut",
      duration: 0.3,
    });
  }
}
