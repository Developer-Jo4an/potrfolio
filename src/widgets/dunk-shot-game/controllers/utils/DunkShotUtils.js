import GameUtils from "../../../../shared/scene/utils/GameUtils";
import {cloneDeep, sample} from "lodash";
import setNecessaryListeners from "./setNecessaryListeners";
import {CENTER, LEFT, RIGHT} from "../../../../shared/constants/src/directions/directions";
import {GAME_SIZE} from "../../constants";
import {dunkShotFactory} from "../factory/DunkShotFactory";

export default class DunkShotUtils extends GameUtils {
  constructor(data) {
    super(data);
  }

  setDefaultProperties(properties) {
    super.setDefaultProperties(properties);
    setNecessaryListeners(this);
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

    const availableMovement = cloneDeep(movement[positionLabel]);

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

    calculateRoadRecurse(positionLabel, cloneDeep(availableMovement));

    return road.map(place => this.getPositionFromRowPosition(row, place));
  }

  getViewportPosition(element) {
    const {canvas} = this;

    const position = element.getGlobalPosition();

    return {
      x: ((global.innerWidth - canvas.offsetWidth) / 2) + position.x,
      y: ((global.innerHeight - canvas.offsetHeight) / 2) + position.y
    };
  }

  calculateTweenPoint(activeBasket, nextBasket) {
    const {storage: {mainSceneSettings: {boosters: {wings: {animation: {tweenPoint}}}}}} = this;

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
