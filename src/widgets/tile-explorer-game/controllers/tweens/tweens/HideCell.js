import {Tween} from "../Tween";
import {GAME} from "../../constants/game";
import {playAnimationOnce} from "@shared";

export class HideCell extends Tween {
  settings = {
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
      vars: {animateObject, view, clip, alpha},
    } = this;

    playAnimationOnce({spine: clip, name: "explosion"});
    clip.state.timeScale = 0;

    let isResolved = false;

    const tween = (this.tween = gsap
      .timeline({
        onStart() {
          clip.alpha = 1;
          clip.state.timeScale = 1;
        },
        onUpdate: () => {
          const progress = tween.progress();
          if (progress >= progressBorder && !isResolved) {
            isResolved = true;
            this.resolve();
          }
        },
        onComplete() {
          view.alpha = 0;
          tween.delete(GAME);
        },
      })
      .save(GAME));

    tween.to(animateObject, {duration: 0.3}).to(view, {alpha, ease: "sine.out", duration: 0.3});

    tween.pause();
  }
}
