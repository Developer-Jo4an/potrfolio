import {createTweenPromise, prepareTween} from "./utils";
import {LineCurve, CurvePath, Vector2} from "@shared";

export function move({target, vars: {points, speed}}) {
  const path = new CurvePath();

  let prevVec = new Vector2(target.x, target.y);
  points.forEach(({x, y}) => {
    const currentVec = new Vector2(x, y);
    path.add(new LineCurve(prevVec, currentVec));
    prevVec = currentVec;
  });

  const proxyVec = new Vector2();

  const tween = gsap.timeline({
    repeat: -1,
    onUpdate() {
      const progress = this.progress();

      path.getPointAt(progress, proxyVec);

      target.x = proxyVec.x;
      target.y = proxyVec.y;
    },
  });

  prepareTween(tween);

  const duration = path.getLength() / speed;

  tween.to({progress: 0}, {progress: 1, ease: "none", duration});

  return {
    tween,
    promise: createTweenPromise(tween),
  };
}
