import {useEffect} from "react";
import {isArray, isObject} from "lodash";

export function useKillGsapTweens(tweens) {
  useEffect(
    () => () => {
      const totalTweens = tweens?.current ?? tweens;
      if (totalTweens instanceof gsap.core.Animation) {
        totalTweens.kill?.();
      } else if (isArray(totalTweens)) {
        totalTweens.forEach((tween) => tween.kill?.());
      } else if (isObject(totalTweens)) {
        for (const key in totalTweens) totalTweens[key]?.kill();
      }
    },
    [],
  );
}
