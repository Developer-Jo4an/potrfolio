import global from "../../../../constants/global/global";

export default async function importPIXILayers() {
  global.PIXI.layers = await import("@pixi/layers");
}