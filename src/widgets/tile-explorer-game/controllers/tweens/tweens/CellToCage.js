import {Tween} from "../Tween";
import {clamp} from "lodash";
import {GAME} from "../../constants/game";

export class CellToCage extends Tween {
  settings = {
    speed: 800, //px/s
    duration: {min: 0.2, max: 0.4},
    progressBorder: 0.5,
  };

  constructor() {
    super(...arguments);

    this.init();
  }

  init() {
    super.init();

    const {
      settings: {progressBorder},
      vars: {animateObject, x, y},
    } = this;

    const duration = this.getDuration();

    let isResolved;

    const tween = (this.tween = gsap
      .timeline({
        onUpdate: () => {
          const progress = tween.progress();

          if (progress >= progressBorder && !isResolved) {
            isResolved = true;
            this.resolve();
          }
        },
        onComplete() {
          tween.delete(GAME);
        },
      })
      .save(GAME));

    tween.to(animateObject, {
      x,
      y,
      ease: "back.inOut",
      duration,
    });
  }

  updateTarget({x, y}) {
    const {
      vars,
      settings: {progressBorder},
      vars: {animateObject},
      tween: prevTween,
    } = this;

    prevTween.delete(GAME);
    this.vars = {...vars, x, y};

    const duration = this.getDuration();

    let isResolved;

    const tween = (this.tween = gsap
      .timeline({
        onUpdate: () => {
          const progress = tween.progress();

          if (progress >= progressBorder && !isResolved) {
            isResolved = true;
            this.resolve();
          }
        },
        onComplete() {
          tween.delete(GAME);
        },
      })
      .save(GAME));

    tween.to(animateObject, {
      x,
      y,
      duration,
      ease: "back.out",
    });
  }

  getDuration() {
    const {
      settings: {
        speed,
        duration: {min, max},
      },
      vars: {animateObject, x, y},
    } = this;

    const distance = Math.hypot(x - animateObject.x, y - animateObject.y);

    return clamp(distance / speed, min, max);
  }
}
