import "../gsap/gsap-global";
import PixiPlugin from "gsap/PixiPlugin";
import * as PIXI from "pixi.js";

global.PIXI = PIXI;
gsap.PIXI = PIXI;
gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);
