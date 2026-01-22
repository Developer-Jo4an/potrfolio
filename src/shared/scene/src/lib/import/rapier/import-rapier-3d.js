export async function importRapier3d() {
  if (global.RAPIER3D) return;
  await import("./rapier3d-global");
}
