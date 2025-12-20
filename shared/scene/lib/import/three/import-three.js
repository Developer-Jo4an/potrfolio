export default async function importThree() {
  global.THREE = await import("three");
  global.THREE.GLTFLoader = (await import("three/addons/loaders/GLTFLoader")).GLTFLoader;
  global.THREE.OrbitControls = (await import("three/addons/controls/OrbitControls")).OrbitControls;
  global.THREE.Interactive = await import("three.interactive");
}