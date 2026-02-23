import {assets, SPRITESHEET} from "@shared";

export const CHARACTER = "character";
export const ENEMIES = "enemies";
export const PLATFORMS = "platforms";
export const ITEMS = "items";

export const preload = [
  {type: SPRITESHEET, name: CHARACTER, src: assets("doodle-jump/character.json")},
  {type: SPRITESHEET, name: ENEMIES, src: assets("doodle-jump/enemies.json")},
  {type: SPRITESHEET, name: PLATFORMS, src: assets("doodle-jump/platforms.json")},
  {type: SPRITESHEET, name: ITEMS, src: assets("doodle-jump/items.json")}
];
