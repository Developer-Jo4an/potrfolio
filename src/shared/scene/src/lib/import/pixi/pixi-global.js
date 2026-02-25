import PixiPlugin from "gsap/PixiPlugin";
import * as PIXI from "pixi.js";
import * as SPINE from "@esotericsoftware/spine-pixi-v8";

global.PIXI = PIXI;
global.PIXI.SPINE = SPINE;

if (global.gsap) {
  global.gsap.PIXI = PIXI;
  global.gsap.registerPlugin(PixiPlugin);
  PixiPlugin.registerPIXI(PIXI);
}
