import global from "../../../../constants/global/global";
import PixiPlugin from "gsap/PixiPlugin";
import gsap from "gsap";

export default async function importPIXI() {
  global.PIXI = await import("pixi.js");
  gsap.registerPlugin(PixiPlugin);
  PixiPlugin.registerPIXI(global.PIXI);
}