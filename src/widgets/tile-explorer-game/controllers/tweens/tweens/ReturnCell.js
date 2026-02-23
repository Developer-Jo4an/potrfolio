import {Tween} from "../Tween";
import {GAME} from "../../constants/game";

export class ReturnCell extends Tween {
  settings = {
    scaleXMultiplier: 1.3,
    scaleYMultiplier: 1.3,
  };

  constructor() {
    super(...arguments);

    this.init();
  }

  init() {
    super.init();

    const {
      settings: {scaleXMultiplier, scaleYMultiplier},
      vars: {animateObject, x, y, scaleX, scaleY},
    } = this;

    const tween = (this.tween = gsap
      .timeline({
        onComplete: () => {
          this.resolve();
          tween.delete(GAME);
        },
      })
      .save(GAME));

    tween
      .to(animateObject, {
        x,
        y,
        ease: "sine.backInOut",
        duration: 0.3,
      })
      .to(
        animateObject,
        {
          scaleX: scaleX * scaleXMultiplier,
          scaleY: scaleY * scaleYMultiplier,
          duration: 0.15,
          ease: "sine.in",
        },
        "<"
      )
      .to(animateObject, {
        scaleX,
        scaleY,
        duration: 0.15,
        ease: "sine.out",
      });
  }
}
