import {Utils} from "./Utils";
import {Tween, Promise as CPromise} from "@shared";

export class TweenUtils extends Utils {
  addTween(eEntity, tween, promise, id, clearAllBefore = false) {
    const cTween = eEntity.get(Tween);
    const cPromise = eEntity.get(CPromise);

    clearAllBefore && this.clearAllTweens(cTween);

    cTween.add(tween, id);
    cPromise.add(promise, id);

    promise.finally(() => {
      cTween.tweens && cTween.remove(id);
    });
  }
}
