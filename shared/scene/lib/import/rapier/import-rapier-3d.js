export default async function importRapier3d() {
  global.RAPIER3D = await import("@dimforge/rapier3d");
}