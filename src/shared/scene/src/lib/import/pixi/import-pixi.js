export async function importPixi() {
  if (global.PIXI) return;
  await import("./pixi-global");
}
