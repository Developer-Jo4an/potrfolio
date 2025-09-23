import AnimationPlayer from "../../../../shared/scene/animations/AnimationPlayer";
import {clamp} from "lodash";
import {toRad, distance, findClosestNumber} from "../../../../shared/lib/matrix/matrix";
import {createProxyObject} from "../../../../shared/lib/proxy/createProxyObject";
import {EIGHT_TENTHS} from "../../../../shared/constants/numbers/numbers";
import {dunkShotUtils} from "../utils/DunkShotUtils";
import {DUNK_SHOT_TWEEN} from "../../constants/constants";
import {PI2} from "../../../../shared/constants/trigonometry/trigonometry";
import {LEFT, RIGHT} from "../../../../shared/constants/directions/directions";
import gsap from "gsap";
import {eventSubscription} from "../../../../shared/lib/events/eventListener";
import {DUNK_SHOT_CONFIG_EVENT, DUNK_SHOT_GAME_DATA_EVENT} from "../../constants/events";
import {STATE_CHANGED} from "../../../../shared/scene/constants/events/names";

class DunkShotAnimationPlayer extends AnimationPlayer {
  constructor(data) {
    super(data);
  }

  setDefaultProperties(properties) {
    super.setDefaultProperties(properties);

    const {eventBus} = this;

    eventSubscription({
      target: eventBus,
      callbacksBus: [
        {
          event: STATE_CHANGED,
          callback: ({state}) => {
            this.state = state;
            this.onStateChanged?.(state);
          }
        },
        {
          event: DUNK_SHOT_GAME_DATA_EVENT,
          callback: ({gameData}) => this.gameData = gameData
        },
        {
          event: DUNK_SHOT_CONFIG_EVENT,
          callback: ({config}) => this.config = config
        }
      ]
    });
  }

  /**
   * basket
   */
  basketHideAnimation(basket) {
    const {view, _factoryUUID} = basket;

    const hideTween = gsap.timeline().save(DUNK_SHOT_TWEEN, `basketHide${_factoryUUID}`);

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

  basketOriginAnimation(basket) {
    const {angle, _factoryUUID} = basket;

    const normalizedAngle = basket.angle = angle % PI2;

    const targetAngle = findClosestNumber(normalizedAngle, 0, PI2, -PI2);

    const originTween = gsap.timeline().save(DUNK_SHOT_TWEEN, `basketOrigin${_factoryUUID}`);

    originTween
    .to(basket, {
      angle: targetAngle,
      ease: "back.out",
      duration: 0.3
    });

    return new Promise(res => originTween.eventCallback("onComplete", () => {
      originTween.delete(DUNK_SHOT_TWEEN);
      res();
    }));
  }

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
    const {storage: {mainSceneSettings: {basket: {circles: circlesSettings}}}} = this;
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
        {element: basketGridBack, scale: circlesSettings.distanceBetween / basketGridBack.width},
        {element: basketBack, scale: circlesSettings.distanceBetween / basketBack.width},
        {element: basketGridFront, scale: circlesSettings.distanceBetween / basketGridFront.width},
        {element: basketFront, scale: circlesSettings.distanceBetween / basketFront.width}
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
   * clover
   */
  cloverShowAnimation(clover) {
    const {view, _factoryUUID} = clover;

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

    const showTween = gsap.timeline().save(DUNK_SHOT_TWEEN, `cloverShow${_factoryUUID}`);

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

  cloverHideAnimation(clover, isImmediate) {
    const {view, _factoryUUID} = clover;

    if (isImmediate) {
      view.alpha = 0;
      return Promise.resolve();
    }

    const hideTween = gsap.timeline().save(DUNK_SHOT_TWEEN, `cloverHide${_factoryUUID}`);

    hideTween
    .to(view, {alpha: 0, duration: 0.3, ease: "sine.inOut"});

    return new Promise(res => hideTween.eventCallback("onComplete", () => {
      hideTween.delete(DUNK_SHOT_TWEEN);
      res();
    }));
  }

  cloverFlyAnimation(clover) {
    const {view, _factoryUUID, side} = clover;

    const multiplier = ({[RIGHT]: 1, [LEFT]: -1})[side];

    const flyTween = gsap.timeline({
      repeat: -1
    }).save(DUNK_SHOT_TWEEN, `cloverFly${_factoryUUID}`);

    flyTween
    .to(view, {rotation: Math.PI / 6 * multiplier, duration: 0.05, ease: "none"})
    .to(view, {rotation: -Math.PI / 6 * multiplier, duration: 0.1, ease: "none"})
    .to(view, {rotation: 0, duration: 0.05, ease: "none"});
  }


  /**
   * boosters
   */
  async cloverBoosterAnimation(ball, leftClover, rightClover, activeBasket, nextBasket) {
    const {storage: {mainSceneSettings: {boosters: {clover: {animation: {offset, cloversAcceleration}}}}}} = this;
    const clovers = [leftClover, rightClover];
    const tweenPoint = dunkShotUtils.calculateTweenPoint(activeBasket, nextBasket);
    const start = {x: ball.x + offset.ballStartPosition.x, y: ball.y + offset.ballStartPosition.y};
    const middle = {x: tweenPoint.x, y: tweenPoint.y};
    const end = {x: dunkShotUtils.getBallTarget(nextBasket).x, y: dunkShotUtils.getBallTarget(nextBasket).y};

    const getCloverPosition = clover => {
      const {side} = clover;
      return ({
        [LEFT]: {x: ball.x - ball.view.width / 2, y: ball.y},
        [RIGHT]: {x: ball.x + ball.view.width / 2, y: ball.y}
      })[side];
    };

    const pureHitTimeline = gsap.timeline({
      onUpdate() {
        const progress = this.progress();

        if (progress < EIGHT_TENTHS || clovers.every(({_factoryUUID}) =>
          gsap.localTimeline.isExist(DUNK_SHOT_TWEEN, `cloverHide${_factoryUUID}`)
        )) return;

        clovers.forEach(clover => dunkShotAnimationPlayer.cloverHideAnimation(clover));
      }
    }).save(DUNK_SHOT_TWEEN, "cloverBooster");

    pureHitTimeline
    .to(ball, {
      x: start.x,
      y: start.y,
      ease: "sine.inOut",
      duration: 0.5
    })
    .set(clovers.map(({view}) => view), {
      x: (_, element) => {
        const {classWrapper: {side}} = element;
        const {x} = getCloverPosition(element.classWrapper);
        return x + ({
          [LEFT]: offset.cloversStartPosition.left,
          [RIGHT]: offset.cloversStartPosition.right
        })[side];
      },
      y: (_, element) => getCloverPosition(element.classWrapper).y
    })
    .to(clovers.map(({view}) => view), {
      x: (_, element) => getCloverPosition(element.classWrapper).x,
      y: (_, element) => getCloverPosition(element.classWrapper).y,
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
        clovers.forEach(dunkShotAnimationPlayer.cloverFlyAnimation);
      },
      onUpdate() {
        const progress = this.progress();

        clovers.map(clover => {
          const {_factoryUUID} = clover;

          const animation = gsap.localTimeline.getTweenByNamespaceAndId(DUNK_SHOT_TWEEN, `cloverFly${_factoryUUID}`);

          if (animation)
            animation.timeScale(Math.min(1, progress * cloversAcceleration));

          const {x, y} = getCloverPosition(clover);
          clover.view.position.set(x, y);
        });
      }
    });

    await new Promise(res => pureHitTimeline.eventCallback("onComplete", () => {
      pureHitTimeline.delete(DUNK_SHOT_TWEEN);

      const allTweens = gsap.localTimeline.getTweensByNamespace(DUNK_SHOT_TWEEN);

      clovers.forEach(clover => {
        allTweens.forEach(tween => {
          if (tween.tweenId?.endsWith?.(clover._factoryUUID))
            tween.delete(DUNK_SHOT_TWEEN);
        });
      });

      res();
    }));
  }
}

export const dunkShotAnimationPlayer = new DunkShotAnimationPlayer();
