import global from "../../../../constants/global/global";
import gsap from "gsap";
import PixiPlugin from "gsap/PixiPlugin";

export default async function importPIXI() {
  global.PIXI = await import("pixi.js");
  gsap.registerPlugin(PixiPlugin);
  PixiPlugin.registerPIXI(global.PIXI);
}