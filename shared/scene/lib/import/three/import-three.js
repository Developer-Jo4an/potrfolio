import global from "../../../../constants/global/global";

export default async function importThree() {
  global.THREE = await import("three");
}