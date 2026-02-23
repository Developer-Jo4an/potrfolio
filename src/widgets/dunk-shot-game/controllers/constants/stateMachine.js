export const INITIALIZATION = "initialization";
export const INITIALIZATION_LEVEL = "initializationLevel";
export const PREPARE = "prepare";
export const PLAYING = "playing";
export const WINGS = "wings";
export const FELL = "fell";
export const WIN = "win";
export const LOSE = "lose";
export const PAUSED = "paused";

export const STATE_MACHINE = {
  [INITIALIZATION]: {
    availableStates: [INITIALIZATION_LEVEL],
    nextState: INITIALIZATION_LEVEL,
    isDefault: true,
    isLoad: true
  },
  [INITIALIZATION_LEVEL]: {availableStates: [PREPARE], nextState: PREPARE, isLoad: true},
  [PREPARE]: {availableStates: [PLAYING], nextState: PLAYING, isAvailableUpdate: true},
  [PLAYING]: {
    availableStates: [WIN, LOSE, PAUSED, FELL, WINGS],
    isAvailableInteraction: true,
    isAvailableCameraUpdate: true,
    isAvailableUpdate: true,
    isAvailableBoosters: true
  },
  [WINGS]: {
    availableStates: [PLAYING, WIN],
    isAvailableCameraUpdate: true,
    isAvailableUpdate: true
  },
  [FELL]: {
    availableStates: [PLAYING],
    nextState: PLAYING,
    isAvailableCameraUpdate: true,
    isAvailableUpdate: true,
    isSubtractLife: true
  },
  [WIN]: {availableStates: [INITIALIZATION], nextState: INITIALIZATION, isEndGame: true},
  [LOSE]: {availableStates: [INITIALIZATION], nextState: INITIALIZATION, isSubtractLife: true, isEndGame: true},
  [PAUSED]: {availableStates: [PLAYING]}
};

export const IGNORE_NEXT_STATES = [PREPARE, PLAYING, WIN, LOSE, PAUSED, WINGS];
