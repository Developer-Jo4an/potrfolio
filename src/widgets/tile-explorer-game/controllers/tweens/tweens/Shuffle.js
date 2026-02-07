import {Tween} from "../Tween";
import {GAME} from "../../../constants/game";

export class Shuffle extends Tween {
  constructor() {
    super(...arguments);

    this.init();
  }

  init() {
    super.init();

    const {
      vars: {animateObjects},
    } = this;

    const tween = (this.tween = gsap
      .timeline({
        onComplete: () => {
          this.resolve();
          tween.delete(GAME);
        },
      })
      .save(GAME));

    animateObjects.forEach(({animateObject, view, vars: {x, y, zIndex, tint}}) => {
      tween
        .to(animateObject, {x, y, ease: "back.inOut(4)", duration: 0.5}, 0)
        .to(view, {pixi: {tint}, zIndex, duration: 0.5, ease: "none"}, 0);
    });
  }
}
