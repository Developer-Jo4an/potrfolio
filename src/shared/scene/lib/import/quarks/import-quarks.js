export default async function importQuarks() {
  THREE.Quarks = await import("three.quarks");
}