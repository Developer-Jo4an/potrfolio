export async function importSat() {
  if (global.SAT) return;
  await import("./sat-global");
}
