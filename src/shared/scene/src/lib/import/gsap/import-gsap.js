export async function importGsap() {
  if (global.gsap) return;
  await import("./gsap-global");
}
