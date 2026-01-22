export async function importThree() {
  if (global.THREE) return;
  await import("./three-global");
}
