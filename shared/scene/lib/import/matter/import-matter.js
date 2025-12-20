export default async function importMatter() {
  global.Matter = await import("matter-js");
}

