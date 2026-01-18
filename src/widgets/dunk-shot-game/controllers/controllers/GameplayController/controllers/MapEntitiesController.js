import BaseGameplayController from "../BaseGameplayController";
import eventSubscription from "../../../../../../shared/lib/src/events/eventListener";
import {velocity} from "../../../../../../shared/lib/src/matrix/matrix";
import {gsapTimeout} from "../../../../../../shared/lib/src/gsap/helpers";
import {dunkShotFactory} from "../../../factory/DunkShotFactory";
import {dunkShotAnimationPlayer} from "../../../animations/DunkShotAnimationPlayer";
import {dunkShotUtils} from "../../../utils/DunkShotUtils";
import {DUNK_SHOT_TWEEN} from "../../../../constants";
import {ACTIVE, FREE, INACTIVE, INSIDE_BASKET, NEXT, PROTECTED, TO_DOWN, TO_UP} from "../../../../constants/statuses";
import {
  BASKET_COLLISION,
  BASKET_SENSOR_COLLISION,
  PROGRESS_RESET,
  THROW_HIT,
  THROW_PURE,
  THROW_PURE_DATA
} from "../../../../constants/events";
import {DUNK_SHOT_STATE_MACHINE, PLAYING, PREPARE, WIN} from "../../../../constants/stateMachine";
import {COMPLETE, START, UPDATE} from "../../../../../../shared/constants/src/statuses/statuses";
import {STATE_DECORATOR_FIELD} from "../../../../../../shared/scene/constants/decorators/names";
import gsap from "gsap";

export default class MapEntitiesController extends BaseGameplayController {
  constructor(data) {
    super(data);

    this.onBasketSensorCollision = this.onBasketSensorCollision.bind(this);
    this.onBasketCollision = this.onBasketCollision.bind(this);
  }

  initEvents() {
    const {eventBus} = this;

    super.initEvents();

    eventSubscription({
      target: eventBus,
      callbacksBus: [
        {event: BASKET_COLLISION, callback: this.onBasketCollision},
        {event: BASKET_SENSOR_COLLISION, callback: this.onBasketSensorCollision}
      ]
    });
  }

  init() {

  }

  initLevelSelect() {
    this.initBaskets();
    this.initSpikes();
    this.initFinish();
  }

  fellSelect() {
    this.callSpecificBehaviour();
  }

  initBaskets() {
    const {config: {configuration: {rows}}, storage: {mainSceneSettings: {basket: {entitiesTypes}}}} = this;

    const basketsRows = rows.filter(({obj}) => Object.keys(entitiesTypes).includes(obj));

    basketsRows.forEach(({num: row, obj, speed, init_pos: position}, index, {length}) => {
      const basket = dunkShotFactory.createItem("basket", {type: entitiesTypes[obj], speed});

      basket.status = !index ? NEXT : INACTIVE;
      basket.isLast = index === length - 1;
      basket.order = index;
      basket.row = row;
      basket.position = dunkShotUtils.getPositionFromRowPosition(row, position);
      basket.positionLabel = position;

      basket.addToSpaces();

      ({
        [INACTIVE]() {
          dunkShotAnimationPlayer.basketInactiveAnimation(basket, true).then(() => basket.view.visible = false);
        },
        [NEXT]() {
          basket.view.visible = true;
          dunkShotAnimationPlayer.basketNextAnimation(basket);
        }
      })[basket.status]?.call(this);
    });
  }

  initSpikes() {
    const {config: {configuration: {rows}}, storage: {mainSceneSettings: {spike: {entitiesTypes}}}} = this;

    const spikeRows = rows.filter(({obj}) => Object.keys(entitiesTypes).includes(obj));

    spikeRows.forEach(({num: row, obj, speed, init_pos: position}) => {
      const spike = dunkShotFactory.createItem("spike", {type: entitiesTypes[obj], speed});

      spike.status = INACTIVE;
      spike.position = dunkShotUtils.getPositionFromRowPosition(row, position);
      spike.positionLabel = position;
      spike.row = row;
      spike.addToSpaces();

      dunkShotAnimationPlayer.spikeInactiveAnimation(spike, true).then(() => spike.view.visible = false);
    });
  }

  initFinish() {
    const {lastBasket} = dunkShotFactory;

    const finish = dunkShotFactory.createItem("finish", {target: lastBasket});
    finish.addToSpaces();
    finish.view.visible = false;
  }

  isGoalToBasket(collisionBody) {
    const {ball} = dunkShotFactory;

    const {wrapper: basket} = collisionBody;

    return ({
      [ACTIVE]: (
        ball.status === TO_DOWN
      ),
      [NEXT]: (
        (ball.status === TO_DOWN || ball.status === FREE || ball.status === PROTECTED)
        &&
        ((ball.position.y <= collisionBody.position.y) || ball.status === PROTECTED)
      )
    })[basket.status];
  }

  async onBasketSensorCollision({collisionBody}) {
    const {decorators} = this;
    const {ball, nextBasket} = dunkShotFactory;
    const {wrapper: basket} = collisionBody;

    if (!this.isGoalToBasket(collisionBody)) return;

    ball.isGravity = false;

    if (basket === nextBasket)
      this.clearSpecificBehaviour();

    const ballTarget = dunkShotUtils.getBallTarget(basket);
    const velocityValue = velocity(ball.velocity.x, ball.velocity.y);
    await dunkShotAnimationPlayer.ballMagnetToBasket(ball, ballTarget.x, ballTarget.y, velocityValue);
    await dunkShotAnimationPlayer.basketCaughtAnimation(basket, velocityValue, () => {
      const {x, y} = dunkShotUtils.getBallTarget(basket);
      ball.position = {x, y};
    });

    ball.status = INSIDE_BASKET;

    this.updateCollisionData(basket);

    if (basket === nextBasket) {
      const {_factoryUUID} = basket;

      this.updateEntitiesStatuses(basket);

      const rotationTween = gsap.localTimeline.getTweenByNamespaceAndId(DUNK_SHOT_TWEEN, `basketRotation${_factoryUUID}`);
      if (rotationTween) {
        rotationTween.delete(DUNK_SHOT_TWEEN);
        await dunkShotAnimationPlayer.basketDefaultAnimation(basket, {rotation: true});
      }

      this.callSpecificBehaviour();

      const stateDecorator = decorators[STATE_DECORATOR_FIELD];

      if (dunkShotUtils.isNextStateWin)
        stateDecorator.state = WIN;
      else if (stateDecorator.state !== PLAYING)
        stateDecorator.state = PLAYING;
    }
  }

  onBasketCollision({collisionBody}) {
    const {idealThrowData: {collisions}} = this;
    const {ball} = dunkShotFactory;

    if (ball.status === TO_UP || ball.status === TO_DOWN)
      collisions.push(collisionBody);
  }

  updateCollisionData(basket) {
    const {state, decorators, eventBus, idealThrowData: {collisions}} = this;
    const {nextBasket} = dunkShotFactory;

    if (state === PREPARE) {
      const stateDecorator = decorators[STATE_DECORATOR_FIELD];
      stateDecorator.state = DUNK_SHOT_STATE_MACHINE[state].nextState;
    } else if (basket === nextBasket) {
      eventBus.dispatchEvent({type: THROW_HIT, position: dunkShotUtils.getViewportPosition(basket.view)});

      if (!collisions.length) {
        eventBus.dispatchEvent({type: THROW_PURE});

        const prevTimeout = gsap.localTimeline.getTweenByNamespaceAndId(DUNK_SHOT_TWEEN, "dunkShot:pure-data");

        if (prevTimeout)
          prevTimeout.delete(DUNK_SHOT_TWEEN);

        const throwEvent = function () {
          const position = dunkShotUtils.getViewportPosition(nextBasket.view);
          eventBus.dispatchEvent({type: THROW_PURE_DATA, pureData: {position, ...this}});
        };

        gsapTimeout({
          timeout: 2,
          namespace: DUNK_SHOT_TWEEN,
          id: "dunkShot:pure-data",
          onStart: throwEvent.bind({isActive: true, stage: START}),
          onUpdate: throwEvent.bind({isActive: true, stage: UPDATE}),
          onComplete: throwEvent.bind({isActive: false, stage: COMPLETE})
        });
      } else
        eventBus.dispatchEvent({type: PROGRESS_RESET});
    } else if (basket === this.activeBasket) {
      if (collisions.length)
        eventBus.dispatchEvent({type: PROGRESS_RESET});
    }

    collisions.length = 0;
  }

  update(milliseconds, deltaTime) {
    const {baskets, spikes, activeBasket} = dunkShotFactory;
    const {
      throwData: {currentData, startData},
      storage: {mainSceneSettings: {throw: {stretch: stretchSettings}}}
    } = this;

    baskets?.forEach(basket => basket.update(deltaTime));
    spikes?.forEach(spike => spike.update(deltaTime));

    if (!currentData || !startData || !activeBasket) return;

    const {stretchMultiplier} = currentData;
    const {basketGridFront, basketGridBack, view} = activeBasket;

    const scaleAddition = stretchSettings.addedValue * stretchMultiplier;
    basketGridFront.scale.y = startData.scale.front.y + scaleAddition;
    basketGridBack.scale.y = startData.scale.back.y + scaleAddition;

    const scaleSubtraction = stretchSettings.subtractValue * stretchMultiplier;
    view.scale.x = startData.scale.view.x - scaleSubtraction;
    activeBasket.angle = currentData.angle;
  }
}
