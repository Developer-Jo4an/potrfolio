import PixiPlugin from "gsap/PixiPlugin";
import * as PIXI from "pixi.js";

// TODO: убрать gsap
global.PIXI = PIXI;
gsap.PIXI = PIXI;
gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);
