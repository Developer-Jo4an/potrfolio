import AnimationPlayer from "../../../../shared/scene/animations/AnimationPlayer";
import {clamp} from "lodash";
import {toRad, distance, findClosestNumber} from "../../../../shared/lib/matrix/matrix";
import {createProxyObject} from "../../../../shared/lib/proxy/createProxyObject";
import {dunkShotUtils} from "../utils/DunkShotUtils";
import {DUNK_SHOT_TWEEN} from "../../constants";
import {PI2} from "../../../../shared/constants/src/trigonometry/trigonometry";
import {LEFT, RIGHT} from "../../../../shared/constants/src/directions/directions";
import gsap from "gsap";
import setNecessaryListeners from "../utils/setNecessaryListeners";

class DunkShotAnimationPlayer extends AnimationPlayer {
  constructor(data) {
    super(data);
  }

  setDefaultProperties(properties) {
    super.setDefaultProperties(properties);
    setNecessaryListeners(this);
  }

  /**
   * basket
   */

  basketNextAnimation(basket, isImmediate) {
    const {view, _factoryUUID} = basket;

    if (isImmediate) {
      view.scale.set(1);
      view.alpha = 1;
      return Promise.resolve();
    }

    const nextTween = gsap.timeline().save(DUNK_SHOT_TWEEN, `basketNext${_factoryUUID}`);

    nextTween.to(view, {
      pixi: {
        scale: 1,
        alpha: 1
      },
      ease: "back.out",
      duration: 0.4
    });

    return new Promise(res => nextTween.eventCallback("onComplete", () => {
      nextTween.delete(DUNK_SHOT_TWEEN);
      res();
    }));
  }

  basketRotationAnimation(basket) {
    const {
      config: {configuration: {global_basket: {swing_angle}}},
      storage: {mainSceneSettings: {basket: {rotation: {speedIntervals}}}}
    } = this;
    const {speed, _factoryUUID} = basket;

    if (!speed) return;

    const radiansSwingAngle = toRad(swing_angle);

    const rotationTween = gsap.timeline({
      repeat: -1
    }).save(DUNK_SHOT_TWEEN, `basketRotation${_factoryUUID}`);

    const fullDuration = speedIntervals[speed - 1];

    rotationTween
    .to(basket, {
      angle: radiansSwingAngle,
      duration: fullDuration / 4,
      ease: "none"
    })
    .to(basket, {
      angle: -radiansSwingAngle,
      duration: fullDuration / 2,
      ease: "none"
    })
    .to(basket, {
      angle: 0,
      duration: fullDuration / 4,
      ease: "none"
    });
  }

  basketInactiveAnimation(basket, isImmediate) {
    const {view, _factoryUUID} = basket;

    if (isImmediate) {
      view.scale.set(0);
      view.alpha = 0;
      return Promise.resolve();
    }

    const inactiveTween = gsap.timeline().save(DUNK_SHOT_TWEEN, `basketInactive${_factoryUUID}`);

    inactiveTween.to(view, {
      pixi: {
        scale: 0,
        alpha: 0
      },
      ease: "back.in",
      duration: 0.4
    });

    return new Promise(res => inactiveTween.eventCallback("onComplete", () => {
      inactiveTween.delete(DUNK_SHOT_TWEEN);
      res();
    }));
  }

  basketCaughtAnimation(basket, velocity, onUpdate) {
    const {_factoryUUID, basketGridFront, angle, storage: {mainSceneSettings: {basket: {caught}}}} = basket;

    if (velocity <= caught.minVelocity) {
      onUpdate?.();
      return Promise.resolve();
    }

    const prevData = {
      scaleY: basketGridFront.scale.y
    };

    const normalizedAngle = basket.angle = angle % PI2;

    const targetAngle = findClosestNumber(normalizedAngle, 0, PI2, -PI2);

    const angleModule = Math.abs(normalizedAngle);

    const caughtAnimation = gsap.timeline({onUpdate}).save(DUNK_SHOT_TWEEN, `basketCaught${_factoryUUID}`);

    caughtAnimation
    .to(basketGridFront.scale, {
      y: prevData.scaleY * caught.degreeOfStretch,
      ease: "sine.out",
      duration: 0.075
    })
    .to(basketGridFront.scale, {
      y: prevData.scaleY,
      ease: "sine.out",
      duration: 0.075
    })
    .to(basket, {
      angle: targetAngle,
      ease: "back.inOut(3.5)",
      duration: clamp(
        angleModule * caught.rotationDuration.multiplier,
        caught.rotationDuration.min,
        caught.rotationDuration.max
      )
    }, 0);

    return new Promise(res => caughtAnimation.eventCallback("onComplete", () => {
      caughtAnimation.delete(DUNK_SHOT_TWEEN);
      res();
    }));
  }

  basketDefaultAnimation(basket, {alpha, rotation, scale} = {}) {
    const {storage: {mainSceneSettings: {basket: {gridBack, back, gridFront, front}}}} = this;
    const {_factoryUUID, view, angle, basketGridBack, basketBack, basketGridFront, basketFront} = basket;

    const defaultTween = gsap.timeline().save(DUNK_SHOT_TWEEN, `basketDefault${_factoryUUID}`);

    if (alpha) {
      if (alpha?.isImmediate)
        view.alpha = 1;
      else
        defaultTween
        .to(view, {alpha: 1, duration: 0.3, ease: "sine.inOut"});
    }

    if (rotation) {
      const normalizedAngle = basket.angle = angle % PI2;
      const targetAngle = findClosestNumber(normalizedAngle, 0, PI2, -PI2);

      if (rotation?.isImmediate)
        basket.angle = targetAngle;
      else
        defaultTween
        .to(basket, {angle: targetAngle, duration: 0.3, ease: "sine.inOut"}, "<");
    }

    if (scale) {
      const elements = [view, basketGridBack, basketBack, basketGridFront, basketFront];

      const prevScales = elements.map(element => ({x: element.scale.x, y: element.scale.y}));

      elements.forEach(element => element.scale.set(1));

      const totalScalesData = [
        {element: view, scale: 1},
        {element: basketGridBack, scale: gridBack.width / basketGridBack.width},
        {element: basketBack, scale: back.width / basketBack.width},
        {element: basketGridFront, scale: gridFront.width / basketGridFront.width},
        {element: basketFront, scale: front.width / basketFront.width}
      ];

      prevScales.forEach((scale, index) => elements[index].scale.set(scale.x, scale.y));

      if (scale.isImmediate)
        totalScalesData.forEach(({element, scale}) => element.scale.set(scale));
      else
        defaultTween
        .to(
          totalScalesData.map(({element}) => element),
          {
            pixi: {
              scale: i => totalScalesData[i].scale
            },
            duration: 0.3,
            ease: "sine.inOut"
          },
          "<"
        );
    }

    return new Promise(res => defaultTween.eventCallback("onComplete", () => {
      defaultTween.delete(DUNK_SHOT_TWEEN);
      res();
    }));
  }


  /**
   * ball
   */
  ballHideAnimation(ball) {
    const {view, _factoryUUID} = ball;

    const hideTween = gsap.timeline().save(DUNK_SHOT_TWEEN, `ballHide${_factoryUUID}`);

    hideTween
    .to(view, {
      alpha: 0,
      ease: "sine.inOut",
      duration: 0.3
    });

    return new Promise(res => hideTween.eventCallback("onComplete", () => {
      hideTween.delete(DUNK_SHOT_TWEEN);
      res();
    }));
  }

  ballShowAnimation(ball) {
    const {view, _factoryUUID, storage: {mainSceneSettings: {ball: ballSettings}}} = ball;

    const startData = {
      scale: {x: view.scale.x / 2, y: view.scale.y / 2}
    };

    view.scale.set(1);
    view.alpha = 0;

    const fields = {
      scaleX: ballSettings.radius * 2 / view.width,
      scaleY: ballSettings.radius * 2 / view.height,
      alpha: 1
    };

    view.scale.set(startData.scale.x, startData.scale.y);

    const showTween = gsap.timeline().save(DUNK_SHOT_TWEEN, `ballShow${_factoryUUID}`);

    showTween
    .to(view, {
      pixi: fields,
      ease: "back.out",
      duration: 0.4
    });

    return new Promise(res => showTween.eventCallback("onComplete", () => {
      showTween.delete(DUNK_SHOT_TWEEN);
      res();
    }));
  }

  ballMagnetToBasket(ball, x, y, velocity) {
    const {
      _factoryUUID,
      storage: {mainSceneSettings: {basket: {magnet: {multiplier, minDistance}}}}
    } = ball;

    const distanceBetween = distance([ball.x, ball.y], [x, y]);

    if (distanceBetween <= minDistance) {
      ball.position = {x, y};
      return Promise.resolve();
    }

    const proxyObject = createProxyObject(ball, "x", "y");

    const magnetTween = gsap.timeline().save(DUNK_SHOT_TWEEN, `ballMagnet${_factoryUUID}`);

    magnetTween
    .to(proxyObject, {
      x, y,
      ease: "sine.out",
      duration: multiplier / velocity
    });

    return new Promise(res => magnetTween.eventCallback("onComplete", () => {
      magnetTween.delete(DUNK_SHOT_TWEEN);
      res();
    }));
  }

  ballDamageAnimation(ball) {
    const {view, _factoryUUID} = ball;

    const damageTween = gsap.to(view, {
      tint: 0xFF0000,
      duration: 0.3,
      ease: "none",
      yoyo: true,
      repeat: -1
    }).save(DUNK_SHOT_TWEEN, `ballDamage${_factoryUUID}`);
  }


  /**
   * finish
   */
  finishShowAnimation(finish) {
    const {_factoryUUID, view} = finish;

    const showTween = gsap.timeline().save(DUNK_SHOT_TWEEN, `finishShow${_factoryUUID}`);

    showTween
    .to(view, {alpha: 1, duration: 0.3, ease: "sine.inOut"});

    return new Promise(res => showTween.eventCallback("onComplete", () => {
      showTween.delete(DUNK_SHOT_TWEEN);
      res();
    }));
  }

  finishHideAnimation(finish) {
    const {view, _factoryUUID} = finish;

    const hideTween = gsap.timeline().save(DUNK_SHOT_TWEEN, `finishHide${_factoryUUID}`);

    hideTween
    .to(view, {alpha: 0, duration: 0.3, ease: "sine.inOut"});

    return new Promise(res => hideTween.eventCallback("onComplete", () => {
      hideTween.delete(DUNK_SHOT_TWEEN);
      res();
    }));
  }


  spikeInactiveAnimation(spike, isImmediate) {
    const {view, _factoryUUID} = spike;

    if (isImmediate) {
      view.scale.set(0);
      view.alpha = 0;
      return Promise.resolve();
    }

    const inactiveTween = gsap.timeline().save(DUNK_SHOT_TWEEN, `spikeInactive${_factoryUUID}`);

    inactiveTween.to(view, {
      pixi: {
        scale: 0,
        alpha: 0
      },
      ease: "back.in",
      duration: 0.2
    });

    return new Promise(res => inactiveTween.eventCallback("onComplete", () => {
      inactiveTween.delete(DUNK_SHOT_TWEEN);
      res();
    }));
  }

  spikeShowAnimation(spike) {
    const {view, _factoryUUID, storage: {mainSceneSettings: {spike: {view: {width, height}}}}} = spike;

    const startData = {
      scale: {x: view.scale.x / 2, y: view.scale.y / 2}
    };

    view.scale.set(1);
    view.alpha = 0;

    const fields = {
      scale: Math.min(width / view.width, height / view.height),
      alpha: 1
    };

    view.scale.set(startData.scale.x, startData.scale.y);

    const showTween = gsap.timeline().save(DUNK_SHOT_TWEEN, `spikeShow${_factoryUUID}`);

    showTween
    .to(view, {
      pixi: fields,
      ease: "back.out",
      duration: 0.4
    });

    return new Promise(res => showTween.eventCallback("onComplete", () => {
      showTween.delete(DUNK_SHOT_TWEEN);
      res();
    }));
  }

  spikeMoveAnimation(spike, availableRoad) {
    const {storage: {mainSceneSettings: {spike: {speedIntervals}}}} = this;
    const {speed, _factoryUUID} = spike;

    if (!speed) return;

    const moveTween = gsap.timeline({repeat: -1, yoyo: true}).save(DUNK_SHOT_TWEEN, `spikeMove${_factoryUUID}`);

    const duration = speedIntervals[speed] * availableRoad.length;

    availableRoad.forEach((position, index, {length}) => {
      moveTween
      .to(spike, {
        x: position.x,
        y: position.y,
        duration: duration / length,
        ease: "none"
      });
    });
  }


  /**
   * wings
   */
  wingsShowAnimation(wings) {
    const {view, _factoryUUID} = wings;

    const prevData = {
      scale: {x: view.scale.x, y: view.scale.y}
    };

    const startData = {
      scale: {x: view.scale.x / 2, y: view.scale.y / 2}
    };

    view.scale.set(1);

    const fields = {
      scaleX: prevData.scale.x,
      scaleY: prevData.scale.y,
      alpha: 1
    };

    view.scale.set(startData.scale.x, startData.scale.y);

    const showTween = gsap.timeline().save(DUNK_SHOT_TWEEN, `wingsShow${_factoryUUID}`);

    showTween
    .to(view, {
      pixi: fields,
      ease: "back.out",
      duration: 0.4
    });

    return new Promise(res => showTween.eventCallback("onComplete", () => {
      showTween.delete(DUNK_SHOT_TWEEN);
      res();
    }));
  }

  wingsHideAnimation(wings, isImmediate) {
    const {view, _factoryUUID} = wings;

    if (isImmediate) {
      view.alpha = 0;
      return Promise.resolve();
    }

    const hideTween = gsap.timeline().save(DUNK_SHOT_TWEEN, `wingsHide${_factoryUUID}`);

    hideTween
    .to(view, {alpha: 0, duration: 0.3, ease: "sine.inOut"});

    return new Promise(res => hideTween.eventCallback("onComplete", () => {
      hideTween.delete(DUNK_SHOT_TWEEN);
      res();
    }));
  }

  wingsFlyAnimation(wings) {
    const {view, _factoryUUID, side} = wings;

    const multiplier = ({[RIGHT]: 1, [LEFT]: -1})[side];

    const flyTween = gsap.timeline({
      repeat: -1
    }).save(DUNK_SHOT_TWEEN, `wingsFly${_factoryUUID}`);

    flyTween
    .to(view, {rotation: Math.PI / 6 * multiplier, duration: 0.05, ease: "none"})
    .to(view, {rotation: -Math.PI / 6 * multiplier, duration: 0.1, ease: "none"})
    .to(view, {rotation: 0, duration: 0.05, ease: "none"});
  }


  /**
   * boosters
   */
  async wingsBoosterAnimation(ball, leftWing, rightWing, activeBasket, nextBasket) {
    const {storage: {mainSceneSettings: {boosters: {wings: {animation: {offset, wingsAcceleration}}}}}} = this;
    const wings = [leftWing, rightWing];
    const tweenPoint = dunkShotUtils.calculateTweenPoint(activeBasket, nextBasket);
    const start = {x: ball.x + offset.ballStartPosition.x, y: ball.y + offset.ballStartPosition.y};
    const middle = {x: tweenPoint.x, y: tweenPoint.y};
    const end = {x: dunkShotUtils.getBallTarget(nextBasket).x, y: dunkShotUtils.getBallTarget(nextBasket).y};

    const getWingPosition = wing => {
      const {side} = wing;
      return ({
        [LEFT]: {x: ball.x - ball.view.width / 2, y: ball.y},
        [RIGHT]: {x: ball.x + ball.view.width / 2, y: ball.y}
      })[side];
    };

    const pureHitTimeline = gsap.timeline({
      onUpdate() {
        const progress = this.progress();

        if (progress < 0.8 || wings.every(({_factoryUUID}) =>
          gsap.localTimeline.isExist(DUNK_SHOT_TWEEN, `wingsHide${_factoryUUID}`)
        )) return;

        wings.forEach(wing => dunkShotAnimationPlayer.wingsHideAnimation(wing));
      }
    }).save(DUNK_SHOT_TWEEN, "wingsBooster");

    pureHitTimeline
    .to(ball, {
      x: start.x,
      y: start.y,
      ease: "sine.inOut",
      duration: 0.5
    })
    .set(wings.map(({view}) => view), {
      x: (_, element) => {
        const {classWrapper: {side}} = element;
        const {x} = getWingPosition(element.classWrapper);
        return x + ({
          [LEFT]: offset.wingsStartPosition.left,
          [RIGHT]: offset.wingsStartPosition.right
        })[side];
      },
      y: (_, element) => getWingPosition(element.classWrapper).y
    })
    .to(wings.map(({view}) => view), {
      x: (_, element) => getWingPosition(element.classWrapper).x,
      y: (_, element) => getWingPosition(element.classWrapper).y,
      alpha: 1,
      duration: 0.3,
      ease: "sine.inOut"
    })
    .to(ball, {
      motionPath: {
        path: [start, middle, end],
        curviness: 2.5,
        autoRotate: false
      },
      delay: 0.2,
      duration: 2.25,
      ease: "sine.inOut",
      onStart() {
        wings.forEach(dunkShotAnimationPlayer.wingsFlyAnimation);
      },
      onUpdate() {
        const progress = this.progress();

        wings.map(wing => {
          const {_factoryUUID} = wing;

          const animation = gsap.localTimeline.getTweenByNamespaceAndId(DUNK_SHOT_TWEEN, `wingsFly${_factoryUUID}`);

          if (animation)
            animation.timeScale(Math.min(1, progress * wingsAcceleration));

          const {x, y} = getWingPosition(wing);
          wing.view.position.set(x, y);
        });
      }
    });

    await new Promise(res => pureHitTimeline.eventCallback("onComplete", () => {
      pureHitTimeline.delete(DUNK_SHOT_TWEEN);

      const allTweens = gsap.localTimeline.getTweensByNamespace(DUNK_SHOT_TWEEN);

      wings.forEach(wing => {
        allTweens.forEach(tween => {
          if (tween.tweenId?.endsWith?.(wing._factoryUUID))
            tween.delete(DUNK_SHOT_TWEEN);
        });
      });

      res();
    }));
  }
}

export const dunkShotAnimationPlayer = new DunkShotAnimationPlayer();
