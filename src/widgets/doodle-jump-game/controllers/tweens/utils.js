import {GAME} from "../constants/game";

export function createTweenPromise(tween) {
  const prevOnComplete = tween.eventCallback("onComplete");

  return new Promise(res => {
    tween.eventCallback("onComplete", () => {
      prevOnComplete?.();
      res();
    });
  });
}

export function prepareTween(tween) {
  tween.save(GAME);

  const prevOnComplete = tween.eventCallback("onComplete");

  tween.eventCallback("onComplete", () => {
    prevOnComplete?.();
    const allTweens = gsap.localTimeline.getTweensByNamespace(GAME);
    allTweens.includes(tween) && tween.delete(GAME);
  });
}
