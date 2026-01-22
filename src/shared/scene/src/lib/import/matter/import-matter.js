export async function importMatter() {
  if (global.Matter) return;
  await import("./matter-global");
}
