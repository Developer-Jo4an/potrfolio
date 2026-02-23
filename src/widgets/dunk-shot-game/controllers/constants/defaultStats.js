import {getDefaultState} from "@shared";
import {STATE_MACHINE} from "./stateMachine";

export const getDefaultStats = () => ({
  state: getDefaultState(STATE_MACHINE),
  boosters: [],
  progress: {current: 0, min: 0, max: 3},
  pureCount: 0,
  bonusesCount: 0,
  isCollectedBonus: false,
  score: 0,
  story: [],
  lifes: 3,
});
