import {Tween} from "../Tween";
import {GAME} from "../../constants/game";

export class Enter extends Tween {
  constructor() {
    super(...arguments);

    this.init();
  }

  init() {
    super.init();

    const {
      vars: {animateObject, scaleX, scaleY},
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
      scaleX,
      scaleY,
      ease: "back.inOut",
      duration: 0.3,
    });
  }
}
