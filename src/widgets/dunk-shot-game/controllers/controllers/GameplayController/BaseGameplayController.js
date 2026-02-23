import {BaseController} from "../BaseController/BaseController";
import {gsapTimeout} from "@shared";
import {factory} from "../../factory/Factory";
import {utils} from "../../utils/Utils";
import {animationPlayer} from "../../animations/AnimationPlayer";
import {DUNK_SHOT_TWEEN} from "../../constants";
import {ACTIVE, INACTIVE, NEXT, TO_DOWN} from "../../constants/statuses";
import {HIDDEN} from "../../constants/modes";
import {BASKET_TIMER_END, BASKET_TIMER_START, BASKET_TIMER_UPDATE, PROGRESS_RESET} from "../../constants/events";

export class BaseGameplayController extends BaseController {
  constructor(data) {
    super(data);
  }

  initEvents() {}

  callSpecificBehaviour() {
    this.applyBurningBasketBehaviour();
  }

  applyBurningBasketBehaviour() {
    const {
      eventBus,
      storage: {
        mainSceneSettings: {
          basket: {entitiesTypes},
        },
      },
      config: {
        configuration: {
          global_basket: {burning_time},
        },
      },
    } = this;
    const {ball, activeBasket} = factory;

    if (!activeBasket || activeBasket?.type !== entitiesTypes.burning_basket) return;

    const {_factoryUUID} = activeBasket;

    const progressEvent = function (burningTween) {
      const progress = burningTween.progress();
      const position = utils.getViewportPosition(activeBasket.view);
      eventBus.dispatchEvent({type: this.type, position, progress});
    };

    gsapTimeout({
      timeout: burning_time / 100,
      namespace: DUNK_SHOT_TWEEN,
      id: `burning${_factoryUUID}`,
      onStart: progressEvent.bind({type: BASKET_TIMER_START}),
      onUpdate: progressEvent.bind({type: BASKET_TIMER_UPDATE}),
    }).then(() => {
      eventBus.dispatchEvent({type: BASKET_TIMER_END});
      eventBus.dispatchEvent({type: PROGRESS_RESET});

      activeBasket.mode = HIDDEN;

      animationPlayer.basketInactiveAnimation(activeBasket);

      ball.isGravity = true;
      ball.status = TO_DOWN;
    });
  }

  clearSpecificBehaviour() {
    this.clearBurningBasketBehaviour();
  }

  clearBurningBasketBehaviour() {
    const {eventBus} = this;
    const {activeBasket} = factory;

    const burningTween = gsap.localTimeline.getTweenByNamespaceAndId(
      DUNK_SHOT_TWEEN,
      `burning${activeBasket?._factoryUUID}`,
    );

    if (burningTween) {
      burningTween.delete(DUNK_SHOT_TWEEN);
      eventBus.dispatchEvent({type: BASKET_TIMER_END});
    }
  }

  updateEntitiesStatuses(activeBasket) {
    const {spikes, finish, baskets} = factory;

    activeBasket.status = ACTIVE;

    const nextBasket = baskets.find(({order: basketOrder}) => basketOrder - 1 === activeBasket.order);
    if (nextBasket) {
      nextBasket.status = NEXT;
      nextBasket.view.visible = true;
      animationPlayer.basketNextAnimation(nextBasket).then(() => {
        animationPlayer.basketRotationAnimation(nextBasket);
      });

      if (nextBasket.isLast) {
        finish.view.visible = true;
        animationPlayer.finishShowAnimation(finish);
      }

      const {row: nextBasketRow} = nextBasket;

      spikes.forEach((spike) => {
        const {row: spikeRow} = spike;

        spike.status = nextBasketRow - spikeRow === 1 ? ACTIVE : INACTIVE;

        ({
          [ACTIVE]() {
            spike.view.visible = true;

            animationPlayer.spikeShowAnimation(spike).then(() => {
              const availableRoad = utils.getSpikeRoad(spike);
              if (availableRoad?.length) animationPlayer.spikeMoveAnimation(spike, availableRoad);
            });
          },
          [INACTIVE]() {
            const {_factoryUUID} = spike;

            const moveTween = gsap.localTimeline.getTweenByNamespaceAndId(DUNK_SHOT_TWEEN, `spikeMove${_factoryUUID}`);
            if (moveTween) moveTween.delete(DUNK_SHOT_TWEEN);

            animationPlayer.spikeInactiveAnimation(spike).then(() => (spike.view.visible = false));
          },
        })[spike.status]?.call(this);
      });
    }

    baskets.forEach((basket) => {
      if (basket !== activeBasket && basket !== nextBasket) {
        basket.status = INACTIVE;
        animationPlayer.basketInactiveAnimation(basket).then(() => (basket.view.visible = false));
      }
    });
  }
}
