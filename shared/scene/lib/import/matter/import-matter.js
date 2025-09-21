import global from "../../../../constants/global/global";

export default async function importMatter() {
  global.Matter = await import("matter-js");
}

