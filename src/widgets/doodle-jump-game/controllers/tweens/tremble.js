import {createTweenPromise, prepareTween} from "./utils";
import {LineCurve, CurvePath, Vector2} from "@shared";

export function tremble({target, vars: {radius, pointsCount, speed}}) {
  const path = new CurvePath();

  let prevVec = new Vector2(target.x, target.y);
  for (let i = 0; i < pointsCount; i++) {
    const randomAngle = Math.PI * 2 * Math.random();
    const cth1 = Math.cos(randomAngle) * radius;
    const cth2 = Math.sin(randomAngle) * radius;

    const currentVec = new Vector2(target.x + cth1, target.y + cth2);
    path.add(new LineCurve(prevVec, currentVec));

    prevVec = currentVec;

    if (i === pointsCount - 1) path.add(new LineCurve(currentVec, new Vector2(target.x, target.y)));
  }

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
