import {BaseGameplayController} from "../BaseGameplayController";
import {eventSubscription, DRAG_END, DRAG_MOVE, DRAG_START, HALF_PI, STATE_DECORATOR_FIELD} from "@shared";
import {factory} from "../../../factory/Factory";
import {animationPlayer} from "../../../animations/AnimationPlayer";
import {utils} from "../../../utils/Utils";
import {DUNK_SHOT_TWEEN, GAME_SIZE} from "../../../constants";
import {LOSE, PROGRESS_RESET, SPIKE_COLLISION} from "../../../constants/events";
import {DAMAGE, FREE, INSIDE_BASKET, TO_UP} from "../../../constants/statuses";
import {FELL, LOSE as LOSE_STATUS} from "../../../constants/stateMachine";

export class BallController extends BaseGameplayController {
  constructor(data) {
    super(data);

    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);

    this.onSpikeCollision = this.onSpikeCollision.bind(this);
  }

  initEvents() {
    const {eventBus} = this;

    super.initEvents();

    eventSubscription({
      target: eventBus,
      callbacksBus: [
        {event: DRAG_START, callback: this.onStart},
        {event: DRAG_MOVE, callback: this.onMove},
        {event: DRAG_END, callback: this.onEnd},
        {event: SPIKE_COLLISION, callback: this.onSpikeCollision}
      ]
    });
  }

  init() {
  }

  initializationLevelSelect() {
    const ball = factory.createItem("ball");
    ball.addToSpaces();
  }

  prepareSelect() {
    const {
      storage: {
        mainSceneSettings: {
          states: {
            prepare: {showingOffset}
          }
        }
      }
    } = this;
    const {ball, nextBasket} = factory;

    ball.isGravity = false;
    ball.position = {x: nextBasket.x + showingOffset.x, y: nextBasket.y + showingOffset.y};
    ball.status = FREE;
  }

  get isCanStart() {
    const {throwData} = this;
    const {ball, activeBasket} = factory;

    return (
      activeBasket &&
      !activeBasket.isLast &&
      ball.status === INSIDE_BASKET &&
      !throwData.startData &&
      !gsap.localTimeline.isExist(DUNK_SHOT_TWEEN, "throwBall")
    );
  }

  onStart() {
    const {isCanStart, throwData} = this;
    const {activeBasket} = factory;

    if (!isCanStart) return;

    const {basketGridFront, basketGridBack, view} = activeBasket;

    throwData.startData = {
      scale: {
        front: {x: basketGridFront.scale.x, y: basketGridFront.scale.y},
        back: {x: basketGridBack.scale.x, y: basketGridBack.scale.y},
        view: {x: view.scale.x, y: view.scale.y}
      }
    };
  }

  get isCanMove() {
    const {throwData} = this;
    const {activeBasket, ball} = factory;

    return (
      activeBasket &&
      !activeBasket.isLast &&
      ball.status === INSIDE_BASKET &&
      throwData.startData &&
      !gsap.localTimeline.isExist(DUNK_SHOT_TWEEN, "throwBall")
    );
  }

  onMove({dragData: {angle, stretch}}) {
    const {
      isCanMove,
      throwData,
      storage: {
        mainSceneSettings: {
          throw: {stretch: stretchSettings}
        }
      }
    } = this;

    if (!isCanMove) return;

    const stretchMultiplier = Math.min(1, stretch / stretchSettings.max);
    const basketAngle = angle - HALF_PI;
    const isCanThrow = stretchMultiplier >= stretchSettings.minStretchValue;

    throwData.currentData = {stretchMultiplier, angle: basketAngle, isCanThrow};
  }

  get isCanEnd() {
    const {throwData} = this;
    const {ball, activeBasket} = factory;

    return (
      activeBasket &&
      !activeBasket.isLast &&
      ball.status === INSIDE_BASKET &&
      throwData.startData &&
      throwData.currentData &&
      !gsap.localTimeline.isExist(DUNK_SHOT_TWEEN, "throwBall")
    );
  }

  onEnd() {
    const {
      isCanEnd,
      throwData,
      storage: {
        mainSceneSettings: {throw: throwSettings}
      }
    } = this;
    const {activeBasket} = factory;

    if (!isCanEnd) return;

    const {startData, currentData} = throwData;
    const {
      scale: {front, back, view: viewScale}
    } = startData;
    const {basketGridBack, basketGridFront, view} = activeBasket;
    const scaleData = [viewScale, back, front];

    let isThrow = false;

    const throwBall = gsap
    .to([view.scale, basketGridBack.scale, basketGridFront.scale], {
      x: (i) => scaleData[i].x,
      y: (i) => scaleData[i].y,
      ease: `back.out(${currentData?.isCanThrow ? 2.5 : 5})`,
      duration: currentData?.isCanThrow ? 0.15 : 0.25,
      onUpdate: () => {
        if (!currentData?.isCanThrow) return;

        const progress = throwBall.progress();

        if (progress < 0.3 || isThrow) return;

        isThrow = true;

        const {angle, stretchMultiplier: power} = currentData;

        this.throwBall(+angle.toFixed(throwSettings.accuracy), +power.toFixed(throwSettings.accuracy));
      },
      onComplete: () => {
        throwBall.delete(DUNK_SHOT_TWEEN);
      }
    })
    .save(DUNK_SHOT_TWEEN, "throwBall");

    throwData.startData = null;
    throwData.currentData = null;
  }

  onSpikeCollision() {
    const {eventBus} = this;
    const {ball} = factory;

    if (utils.isNextStateLose)
      eventBus.dispatchEvent({type: LOSE, status: LOSE_STATUS});
    else {
      ball.status = DAMAGE;
      animationPlayer.ballDamageAnimation(ball);
    }
  }

  throwBall(angle, power) {
    const {
      storage: {
        mainSceneSettings: {throw: throwSettings}
      }
    } = this;
    const {ball} = factory;

    ball.isGravity = true;

    const formattedAngle = angle + (Math.PI * 3) / 2;
    const speed = power * throwSettings.power.linear;

    Matter.Body.applyForce(ball.body, ball.position, {
      x: Math.cos(formattedAngle) * speed,
      y: Math.sin(formattedAngle) * speed
    });
    Matter.Body.setAngularVelocity(ball.body, (angle > 0 ? -1 : 1) * (power * throwSettings.power.angular));

    ball.status = TO_UP;
  }

  followBasket() {
    const {ball, activeBasket} = factory;

    if (activeBasket && ball.status === INSIDE_BASKET) {
      const {angle, x, y} = utils.getBallTarget(activeBasket);
      ball.position = {x, y};
      ball.angle = angle;
    }
  }

  checkFell() {
    const {ball, mainContainer} = factory;
    const {
      eventBus,
      decorators,
      storage: {
        mainSceneSettings: {
          ball: {radius}
        }
      }
    } = this;
    const stateDecorator = decorators[STATE_DECORATOR_FIELD];

    if (ball.position.y + mainContainer.view.position.y + radius >= GAME_SIZE.height) {
      eventBus.dispatchEvent({type: PROGRESS_RESET});
      if (utils.isNextStateLose)
        eventBus.dispatchEvent({type: LOSE, status: LOSE_STATUS});
      else stateDecorator.state = FELL;
    }
  }

  update() {
    const {ball} = factory;

    ball.update();

    this.followBasket();
    this.checkFell();
  }
}
