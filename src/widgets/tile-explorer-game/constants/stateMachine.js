export const INITIALIZATION = "initialization";
export const APPLY = "apply";
export const INITIALIZATION_LEVEL = "initializationLevel";
export const PLAYING = "playing";
export const PAUSED = "paused";
export const LOSING = "losing";
export const WINNING = "winning";
export const LOSE = "lose";
export const WIN = "win";

export const STATE_MACHINE = {
  [INITIALIZATION]: {
    availableStates: [APPLY],
    nextState: APPLY,
    isDefault: true,
    isLoad: true
  },
  [APPLY]: {availableStates: [INITIALIZATION_LEVEL], nextState: INITIALIZATION_LEVEL, isLoad: true},
  [INITIALIZATION_LEVEL]: {availableStates: [PLAYING], nextState: PLAYING, isLoad: true},
  [PLAYING]: {availableStates: [LOSING, WINNING, PAUSED], isAvailableUpdate: true, isAvailableInteractive: true},
  [PAUSED]: {availableStates: [PLAYING]},
  [LOSING]: {availableStates: [LOSE], nextState: LOSE},
  [WINNING]: {availableStates: [WIN], nextState: WIN},
  [LOSE]: {availableStates: [INITIALIZATION_LEVEL], nextState: INITIALIZATION_LEVEL},
  [WIN]: {availableStates: [INITIALIZATION_LEVEL], nextState: INITIALIZATION_LEVEL}
};

export const IGNORE_NEXT_STATES = [PLAYING, PAUSED, LOSE, WIN];
