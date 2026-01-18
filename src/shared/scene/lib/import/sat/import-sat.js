export default async function importSat() {
  global.SAT = await import("sat");
}