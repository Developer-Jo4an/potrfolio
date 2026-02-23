import {BACK, MIX, HELP} from "./boosters";

export const gameSpace = {
  currentTime: null,
  score: 0,
  booster: {active: null, [BACK]: 3, [MIX]: 3, [HELP]: 3},
};