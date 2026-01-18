export const INITIALIZATION = "initialization";
export const INITIALIZATION_LEVEL = "initializationLevel";
export const PLAYING = "playing";
export const PAUSED = "paused";
export const LOSE = "lose";
export const WIN = "win";

export const CAR_STATE_MACHINE = {
  [INITIALIZATION]: {
    availableStates: [INITIALIZATION_LEVEL],
    nextState: INITIALIZATION_LEVEL,
    isDefault: true,
    isLoad: true
  },
  [INITIALIZATION_LEVEL]: {
    availableStates: [PLAYING],
    nextState: PLAYING,
    isLoad: true
  },
  [PLAYING]: {
    availableStates: [LOSE, WIN, PAUSED],
    isAvailableUpdate: true
  },
  [PAUSED]: {
    availableStates: [PLAYING]
  },
  [LOSE]: {
    availableStates: [INITIALIZATION_LEVEL],
    nextState: INITIALIZATION_LEVEL,
    isEndGame: true
  },
  [WIN]: {
    availableStates: [INITIALIZATION_LEVEL],
    nextState: INITIALIZATION_LEVEL,
    isEndGame: true
  }
};

export const IGNORE_NEXT_STATES = [PLAYING, PAUSED, LOSE, WIN];