import {GAME_SIZE} from "./game";

export const MAIN_SCENE_SETTINGS = {
  shift: [
    [0, 0],
    [-1, 0],
    [0, -1],
    [-1, -1],
  ],
  cell: {
    anchor: 0.5,
    size: 80,
    signSizeMultiplier: 0.8,
  },
  grid: {
    size: GAME_SIZE.width - 20,
    paddingTop: 120,
  },
};
