import {GameSpaceStore} from "@shared";
import {CLEAR_HIT, EXTRA_LIFE, X2} from "../../constants/boosters";

const gameSpaceStore = new GameSpaceStore({
  gameData: {balls: 10, score: 0, target: 15, lifes: 3, story: [], pureCount: 0},
  characterMovement: {
    returnsBack: false,
    thrown: false,
    isCollisionWithRing: false,
    isCollisionWithSensor: false,
    isFlewSensor: false,
    isDrag: false,
  },
  booster: {active: null, [X2]: 3, [EXTRA_LIFE]: 3, [CLEAR_HIT]: 3},
  serviceData: {clearFunctions: []},
});

export {gameSpaceStore};
