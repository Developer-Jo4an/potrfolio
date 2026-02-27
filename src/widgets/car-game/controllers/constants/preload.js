import {TEXTURE, assets} from "@shared";

export const ACTOR = "actor";
export const ROAD_CHUNK = "roadChunk";
export const BONUS = "bonus";
export const BLOCK = "block";

export const preload = [
  {type: TEXTURE, name: ACTOR, src: assets("car/actor.png")},
  {type: TEXTURE, name: ROAD_CHUNK, src: assets("car/roadChunk.png")},
  {type: TEXTURE, name: BONUS, src: assets("car/bonus.png")},
  {type: TEXTURE, name: BLOCK, src: assets("car/block.png")},
];
