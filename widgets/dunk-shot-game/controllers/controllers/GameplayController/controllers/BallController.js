import BaseGameplayController from "../BaseGameplayController";
import {eventSubscription} from "../../../../../../shared/lib/events/eventListener";
import {dunkShotFactory} from "../../../factory/DunkShotFactory";
import {dunkShotAnimationPlayer} from "../../../animations/DunkShotAnimationPlayer";
import {dunkShotUtils} from "../../../utils/DunkShotUtils";
import {DUNK_SHOT_TWEEN, GAME_SIZE} from "../../../../constants/constants";
import {DRAG_END, DRAG_MOVE, DRAG_START} from "../../../../../../shared/constants/events/eventsNames";
import {PROGRESS_RESET, SPIKE_COLLISION} from "../../../../constants/events";
import {DAMAGE, FREE, INSIDE_BASKET, TO_UP} from "../../../../constants/statuses";
import {HALF_PI} from "../../../../../../shared/constants/trigonometry/trigonometry";
import {FIVE, QUARTER, THIRD, TWO_AND_HALF, ZERO_FIFTEEN} from "../../../../../../shared/constants/numbers/numbers";
import global from "../../../../../../shared/constants/global/global";
import {STATE_DECORATOR_FIELD} from "../../../../../../shared/scene/constants/decorators/names";
import {FELL, LOSE} from "../../../../constants/stateMachine";
import gsap from "gsap";

export default class BallController extends BaseGameplayController {
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

  initLevelSelect() {
    const ball = dunkShotFactory.createItem("ball");
    ball.addToSpaces();
  }

  prepareSelect() {
    const {storage: {mainSceneSettings: {states: {prepare: {showingOffset}}}}} = this;
    const {ball, nextBasket} = dunkShotFactory;

    ball.isGravity = false;
    ball.position = {x: nextBasket.x + showingOffset.x, y: nextBasket.y + showingOffset.y};
    ball.status = FREE;
  }

  get isCanStart() {
    const {throwData} = this;
    const {ball, activeBasket} = dunkShotFactory;

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
    const {activeBasket} = dunkShotFactory;

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
    const {activeBasket, ball} = dunkShotFactory;

    return (
      activeBasket &&
      !activeBasket.isLast &&
      ball.status === INSIDE_BASKET &&
      throwData.startData &&
      !gsap.localTimeline.isExist(DUNK_SHOT_TWEEN, "throwBall")
    );
  }

  onMove({dragData: {angle, stretch}}) {
    const {isCanMove, throwData, storage: {mainSceneSettings: {throw: {stretch: stretchSettings}}}} = this;

    if (!isCanMove) return;

    const stretchMultiplier = Math.min(1, stretch / stretchSettings.max);
    const basketAngle = angle - HALF_PI;
    const isCanThrow = stretchMultiplier >= stretchSettings.minStretchValue;

    throwData.currentData = {
      stretchMultiplier,
      angle: basketAngle,
      isCanThrow
    };
  }


  get isCanEnd() {
    const {throwData} = this;
    const {ball, activeBasket} = dunkShotFactory;

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
    const {isCanEnd, throwData, storage: {mainSceneSettings: {throw: throwSettings}}} = this;
    const {activeBasket} = dunkShotFactory;

    if (!isCanEnd) return;

    const {startData, currentData} = throwData;
    const {scale: {front, back, view: viewScale}} = startData;
    const {basketGridBack, basketGridFront, view} = activeBasket;
    const scaleData = [viewScale, back, front];

    let isThrow = false;

    const throwBall = gsap.to([view.scale, basketGridBack.scale, basketGridFront.scale], {
      x: i => scaleData[i].x,
      y: i => scaleData[i].y,
      ease: `back.out(${currentData?.isCanThrow ? TWO_AND_HALF : FIVE})`,
      duration: currentData?.isCanThrow ? ZERO_FIFTEEN : QUARTER,
      onUpdate: () => {
        if (!currentData?.isCanThrow) return;

        const progress = throwBall.progress();

        if (progress < THIRD || isThrow) return;

        isThrow = true;

        const {angle, stretchMultiplier: power} = currentData;

        this.throwBall(
          +angle.toFixed(throwSettings.accuracy),
          +power.toFixed(throwSettings.accuracy)
        );
      },
      onComplete: () => {
        throwBall.delete(DUNK_SHOT_TWEEN);
      }
    }).save(DUNK_SHOT_TWEEN, "throwBall");

    throwData.startData = null;
    throwData.currentData = null;
  }

  onSpikeCollision() {
    const {decorators} = this;
    const {ball} = dunkShotFactory;
    const stateDecorator = decorators[STATE_DECORATOR_FIELD];

    if (dunkShotUtils.isNextStateLose)
      stateDecorator.state = LOSE;
    else {
      ball.status = DAMAGE;
      dunkShotAnimationPlayer.ballDamageAnimation(ball);
    }
  }

  throwBall(angle, power) {
    const {storage: {mainSceneSettings: {throw: throwSettings}}} = this;
    const {ball} = dunkShotFactory;

    ball.isGravity = true;

    const formattedAngle = angle + (Math.PI * 3 / 2);
    const speed = power * throwSettings.power.linear;

    global.Matter.Body.applyForce(ball.body, ball.position, {
      x: Math.cos(formattedAngle) * speed,
      y: Math.sin(formattedAngle) * speed
    });
    global.Matter.Body.setAngularVelocity(
      ball.body,
      (angle > 0 ? -1 : 1) * (power * throwSettings.power.angular)
    );

    ball.status = TO_UP;
  }

  followBasket() {
    const {ball, activeBasket} = dunkShotFactory;

    if (activeBasket && ball.status === INSIDE_BASKET) {
      const {angle, x, y} = dunkShotUtils.getBallTarget(activeBasket);
      ball.position = {x, y};
      ball.angle = angle;
    }
  }

  checkFell() {
    const {ball, mainContainer} = dunkShotFactory;
    const {eventBus, decorators, storage: {mainSceneSettings: {ball: {radius}}}} = this;
    const stateDecorator = decorators[STATE_DECORATOR_FIELD];

    if (ball.position.y + mainContainer.view.position.y + radius >= GAME_SIZE.height) {
      eventBus.dispatchEvent({type: PROGRESS_RESET});
      stateDecorator.state = dunkShotUtils.isNextStateLose ? LOSE : FELL;
    }
  }

  update() {
    const {ball} = dunkShotFactory;

    ball.update();

    this.followBasket();
    this.checkFell();
  }
}
