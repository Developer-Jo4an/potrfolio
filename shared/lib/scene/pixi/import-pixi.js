import global from "../../../constants/global/global";

export default async function importPixi() {
  global.PIXI = await import("pixi.js");
}