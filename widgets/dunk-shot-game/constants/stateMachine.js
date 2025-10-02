export const INITIALIZATION = "initialization";
export const INIT_LEVEL = "initLevel";
export const PREPARE = "prepare";
export const PLAYING = "playing";
export const WINGS = "wings";
export const FELL = "fell";
export const WIN = "win";
export const LOSE = "lose";
export const PAUSE = "pause";

export const DUNK_SHOT_STATE_MACHINE = {
  [INITIALIZATION]: {
    availableStates: [INIT_LEVEL],
    nextState: INIT_LEVEL,
    isDefault: true,
    isLoad: true
  },
  [INIT_LEVEL]: {
    availableStates: [PREPARE],
    nextState: PREPARE,
    isLoad: true
  },
  [PREPARE]: {
    availableStates: [PLAYING],
    nextState: PLAYING,
    isAvailableUpdate: true
  },
  [PLAYING]: {
    availableStates: [WIN, LOSE, PAUSE, FELL, WINGS],
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
  [WIN]: {
    availableStates: [INITIALIZATION],
    nextState: INITIALIZATION,
    isEndGame: true
  },
  [LOSE]: {
    availableStates: [INITIALIZATION],
    nextState: INITIALIZATION,
    isSubtractLife: true,
    isEndGame: true
  },
  [PAUSE]: {
    availableStates: [PLAYING]
  }
};

export const IGNORE_NEXT_STATES = [PREPARE, PLAYING, WIN, LOSE, PAUSE, WINGS];






