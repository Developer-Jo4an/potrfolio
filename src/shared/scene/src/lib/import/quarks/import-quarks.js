export async function importQuarks() {
  if (global.Quarks) return;
  await import("./quarks-global");
}
