import {dunkShotStateMachine} from "./stateMachine";
import {getDefaultState} from "../../../shared/scene/lib/state/getDefaultState";

export const getDunkShotDefaultStats = () => ({
  state: getDefaultState(dunkShotStateMachine),
  boosters: [],
  progress: {current: 0, min: 0, max: 3},
  pureCount: 0,
  bonusesCount: 0,
  isCollectedBonus: false,
  score: 0,
  story: [],
  lifes: 3
});