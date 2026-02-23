import {createTweenPromise, prepareTween} from "./utils";

const settings = {
  duration: 2,
  ease: "sine.in",
};

export function fall({target, vars: {y}, callbacks: {onComplete} = {}}) {
  const tween = gsap.timeline({onComplete});

  prepareTween(tween);

  tween.to(target, {y, ...settings});

  return {
    tween,
    promise: createTweenPromise(tween),
  };
}
