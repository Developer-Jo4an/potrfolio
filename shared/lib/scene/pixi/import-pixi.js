import global from "../../../constants/global/global";

export default async function importPIXI() {
  global.PIXI = await import("pixi.js");
}