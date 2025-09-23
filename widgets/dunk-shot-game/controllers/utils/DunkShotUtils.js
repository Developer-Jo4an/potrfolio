import GameUtils from "../../../../shared/scene/utils/GameUtils";
import {sample} from "lodash";
import {copy} from "../../../../shared/lib/copy/copy";
import {CENTER, LEFT, RIGHT} from "../../../../shared/constants/directions/directions";
import {GAME_SIZE} from "../../constants/constants";
import {dunkShotFactory} from "../factory/DunkShotFactory";
import {eventSubscription} from "../../../../shared/lib/events/eventListener";
import {DUNK_SHOT_CONFIG_EVENT, DUNK_SHOT_GAME_DATA_EVENT} from "../../constants/events";
import {STATE_CHANGED} from "../../../../shared/scene/constants/events/names";

export default class DunkShotUtils extends GameUtils {
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
          callback: ({gameData}) => {
            debugger
            this.gameData = gameData
          }
        },
        {
          event: DUNK_SHOT_CONFIG_EVENT,
          callback: ({config}) => this.config = config
        }
      ]
    });
  }

  get isNextStateLose() {
    const {gameData} = this;
    return gameData.lifes - 1 <= 0;
  }

  get isNextStateWin() {
    const {activeBasket} = dunkShotFactory;
    return activeBasket?.isLast;
  }

  getBallTarget(basket) {
    const {storage: {mainSceneSettings: {ball: ballSettings}}} = this;
    const {basketGridFront, angle} = basket;
    const {ball} = dunkShotFactory;

    const distance = basketGridFront.height - ballSettings.radius;
    const formattedAngle = angle - Math.PI * 3 / 2;

    return {
      x: basket.position.x + Math.cos(formattedAngle) * distance,
      y: basket.position.y + Math.sin(formattedAngle) * distance,
      angle: angle + (ball.savedData.lastAngle ?? 0)
    };
  }

  getPositionFromRowPosition(row, position) {
    const {storage: {mainSceneSettings: {grid: {segments, padding}}}} = this;

    const {bounding} = segments[position];

    return {
      x: GAME_SIZE.width * bounding.x + GAME_SIZE.width * bounding.widthMultiplier / 2,
      y: GAME_SIZE.height - padding.bottom - row * GAME_SIZE.height * bounding.heightMultiplier
    };
  }

  getSpikeRoad(spike) {
    const {storage: {mainSceneSettings: {spike: {movement}}}} = this;
    const {baskets} = dunkShotFactory;
    const {positionLabel, row} = spike;

    const availableMovement = copy(movement[positionLabel]);

    baskets.forEach(({row: basketRow, positionLabel}) => {
      if (basketRow === row && availableMovement.includes(positionLabel))
        availableMovement.splice(availableMovement.indexOf(positionLabel), 1);
    });

    const road = [];

    const calculateRoadRecurse = (positionLabel, availableMovement) => {

      for (const place of availableMovement)
        if (movement[positionLabel].includes(place)) {
          road.push(place);
          calculateRoadRecurse(place, availableMovement.filter(placeLabel => placeLabel !== place));
        }
    };

    calculateRoadRecurse(positionLabel, copy(availableMovement));

    return road.map(place => this.getPositionFromRowPosition(row, place));
  }

  getViewportPosition(element) {
    const {canvas} = this;

    const position = element.getGlobalPosition();

    return {
      x: ((window.innerWidth - canvas.offsetWidth) / 2) + position.x,
      y: ((window.innerHeight - canvas.offsetHeight) / 2) + position.y
    };
  }

  calculateTweenPoint(activeBasket, nextBasket) {
    const {storage: {mainSceneSettings: {boosters: {clover: {animation: {tweenPoint}}}}}} = this;

    const {positionLabel: activeBasketPositionLabel} = activeBasket;
    const {positionLabel: nextBasketPositionLabel} = nextBasket;

    if ([LEFT, RIGHT].includes(nextBasketPositionLabel)) {
      const {y} = nextBasket;
      return {
        x: GAME_SIZE.width / 2,
        y: y + GAME_SIZE.height * tweenPoint.yMultiplier
      };
    }

    const actions = {
      [LEFT]() {
        const {y} = nextBasket;
        return {
          x: GAME_SIZE.width * tweenPoint.xMultiplier,
          y: y + GAME_SIZE.height * tweenPoint.yMultiplier
        };
      },
      [RIGHT]() {
        const {y} = nextBasket;
        return {
          x: GAME_SIZE.width - (GAME_SIZE.width * tweenPoint.xMultiplier),
          y: y + GAME_SIZE.height * tweenPoint.yMultiplier
        };
      },
      [CENTER]() {
        return actions[sample([RIGHT, LEFT])]?.();
      }
    };

    return actions[activeBasketPositionLabel]?.();
  }
}

export const dunkShotUtils = new DunkShotUtils();
