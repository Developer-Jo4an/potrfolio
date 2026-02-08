import PixiPlugin from "gsap/PixiPlugin";
import * as PIXI from "pixi.js";
import * as SPINE from "@esotericsoftware/spine-pixi-v8";
import * as filters from "pixi-filters";

global.PIXI = PIXI;
global.PIXI.SPINE = SPINE;
global.PIXI.filters = filters;

if (global.gsap) {
  gsap.PIXI = PIXI;
  gsap.registerPlugin(PixiPlugin);
  PixiPlugin.registerPIXI(PIXI);
}
