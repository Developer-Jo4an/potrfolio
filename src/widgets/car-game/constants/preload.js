import {TEXTURE, assets} from "@shared";

export const CHARACTER = "character";
export const ROAD_CHUNK = "roadChunk";
export const BONUS = "bonus";
export const SPIKE = "spike";

export const preload = [
  {type: TEXTURE, name: CHARACTER, src: assets("car/character.png")},
  {type: TEXTURE, name: ROAD_CHUNK, src: assets("car/roadChunk.png")},
  {type: TEXTURE, name: BONUS, src: assets("car/bonus.png")},
  {type: TEXTURE, name: SPIKE, src: assets("car/spike.png")}
];
