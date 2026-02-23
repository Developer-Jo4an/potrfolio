import {createTweenPromise, prepareTween} from "./utils";

const settings = {
  duration: 0.3,
  ease: "sine.inOut",
};

export function hide({target, vars: {alpha}, callbacks: {onComplete} = {}}) {
  const tween = gsap.timeline({onComplete});

  prepareTween(tween);

  tween.to(target, {
    alpha,
    ...settings,
  });

  return {
    tween,
    promise: createTweenPromise(tween),
  };
}
