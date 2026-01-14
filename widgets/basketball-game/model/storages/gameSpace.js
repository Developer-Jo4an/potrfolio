import {cloneDeep} from "lodash";

let gameSpace = getDefaultValue();

const listeners = new Set();
const gameSpaceStore = {
  set(func) {
    func(gameSpace);
    gameSpace = cloneDeep(gameSpace);
    listeners.forEach(listener => listener());
  },
  reset() {
    gameSpace = getDefaultValue();
  },
  getSnapshot() {
    return gameSpace;
  },

  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
};

export default gameSpaceStore;

function getDefaultValue() {
  return {
    gameData: {
      balls: 10,
      score: 0,
      target: 10,
      lifes: 3000
    },
    characterMovement: {
      returnsBack: false,
      thrown: false,
      isCollisionWithRing: false,
      isCollisionWithSensor: false,
      isFlewSensor: false,
      isDrag: false
    },
    booster: {
      active: null
    },
    serviceData: {
      clearFunctions: []
    }
  };
}