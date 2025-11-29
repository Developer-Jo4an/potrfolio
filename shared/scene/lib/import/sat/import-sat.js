import global from "../../../../constants/global/global";

export default async function importSat() {
  global.SAT = await import("sat");
}