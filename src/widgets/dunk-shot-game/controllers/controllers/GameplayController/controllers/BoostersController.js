import BaseGameplayController from "../BaseGameplayController";
import {gsapUpdate} from "../../../../../../shared/lib/gsap/helpers";
import {dunkShotFactory} from "../../../factory/DunkShotFactory";
import {dunkShotAnimationPlayer} from "../../../animations/DunkShotAnimationPlayer";
import {dunkShotUtils} from "../../../utils/DunkShotUtils";
import {DUNK_SHOT_TWEEN} from "../../../../constants";
import {DUNK_SHOT_STATE_MACHINE} from "../../../../constants/stateMachine";
import {INSIDE_BASKET, PROTECTED} from "../../../../constants/statuses";
import {LEFT, RIGHT} from "../../../../../../shared/constants/src/directions/directions";
import {BOOSTERS_SET_DISABLED} from "../../../../constants/events";
import gsap from "gsap";

export default class BoostersController extends BaseGameplayController {
  constructor(data) {
    super(data);
  }

  initEvents() {

  }

  init() {

  }

  async wingsSelect() {
    const {ball, activeBasket, nextBasket, activeSpike} = dunkShotFactory;

    ball.status = PROTECTED;
    ball.isGravity = false;

    this.clearSpecificBehaviour();

    const updateBall = gsapUpdate({
      namespace: DUNK_SHOT_TWEEN,
      id: "followBasket",
      onUpdate() {
        const {angle, x, y} = dunkShotUtils.getBallTarget(activeBasket);
        ball.position = {x, y};
        ball.angle = angle;
      }
    });

    const beforeAnimationPromises = [];

    const tweens = gsap.localTimeline.getTweensByNamespace(DUNK_SHOT_TWEEN);

    [activeBasket, nextBasket].forEach(basket => {
      if (!basket) return;

      tweens.forEach(tween => {
        const {tweenId} = tween;
        if (tweenId?.endsWith?.(basket._factoryUUID))
          tween.delete(DUNK_SHOT_TWEEN);
      });

      beforeAnimationPromises.push(dunkShotAnimationPlayer.basketDefaultAnimation(basket, {
        alpha: true,
        scale: true,
        rotation: true
      }));
    });

    if (activeSpike)
      beforeAnimationPromises.push(dunkShotAnimationPlayer.spikeInactiveAnimation(activeSpike));

    await Promise.all(beforeAnimationPromises);

    updateBall.delete(DUNK_SHOT_TWEEN);

    const [leftWing, rightWing] = [LEFT, RIGHT].map(side => {
      const wing = dunkShotFactory.createItem("wing");
      wing.addToSpaces();
      wing.side = side;
      dunkShotAnimationPlayer.wingsHideAnimation(wing, true);
      return wing;
    });

    await dunkShotAnimationPlayer.wingsBoosterAnimation(ball, leftWing, rightWing, activeBasket, nextBasket);

    ball.isGravity = true;
  }

  get isDisabledBoosters() {
    const {gameData} = this;

    return gameData?.boosters?.every(({isDisabled}) => isDisabled);
  }

  set isDisabledBoosters(isDisabledBoosters) {
    const {eventBus} = this;

    eventBus.dispatchEvent({type: BOOSTERS_SET_DISABLED, isDisabled: isDisabledBoosters});
  }

  checkBoostersDisabled() {
    const {throwData, state, isDisabledBoosters} = this;
    const {ball} = dunkShotFactory;

    if (DUNK_SHOT_STATE_MACHINE[state]?.isAvailableBoosters && ball.status === INSIDE_BASKET) {
      if (Object.values(throwData).every(Boolean))
        !isDisabledBoosters && (this.isDisabledBoosters = true);
      else
        isDisabledBoosters && (this.isDisabledBoosters = false);
    } else
      !isDisabledBoosters && (this.isDisabledBoosters = true);
  }

  update() {
    this.checkBoostersDisabled();
  }
}