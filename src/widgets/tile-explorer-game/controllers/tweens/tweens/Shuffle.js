import {Tween} from "../Tween";
import {Cell} from "../../assets/Cell";
import {playAnimationOnce} from "@shared";
import {GAME} from "../../constants/game";

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

    animateObjects.forEach(({animateObject, view, vars: {x, y, zIndex, isBlocked}}) => {
      const blockedSpineClip = view.getChildByLabel(Cell.types.blocked);
      blockedSpineClip.alpha = 1;

      playAnimationOnce({
        spine: blockedSpineClip,
        name: "explosion",
        reverse: isBlocked,
      }).then(async () => {
        if (isBlocked) {
          await playAnimationOnce({spine: blockedSpineClip, name: "explosion_1", reverse: isBlocked});
          playAnimationOnce({spine: blockedSpineClip, name: "idle_1", pause: true});
        }

        blockedSpineClip.alpha = +isBlocked;
      });

      tween
        .to(
          animateObject,
          {
            x,
            y,
            ease: "back.inOut(4)",
            duration: 0.5,
          },
          0,
        )
        .to(
          view,
          {
            zIndex,
            ease: "none",
            duration: 0.5,
          },
          0,
        );
    });
  }
}
