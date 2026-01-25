import {TEXTURE, assets} from "@shared";

export const CELL = "cell";
export const WATERMELON = "watermelon";
export const ORANGE = "orange";
export const CHERRY = "cherry";

export const preload = [
  {type: TEXTURE, name: CELL, src: assets("tile-explorer/cell.png")},
  {type: TEXTURE, name: WATERMELON, src: assets("tile-explorer/watermelon.png")},
  {type: TEXTURE, name: ORANGE, src: assets("tile-explorer/orange.png")},
  {type: TEXTURE, name: CHERRY, src: assets("tile-explorer/cherry.png")},
];
