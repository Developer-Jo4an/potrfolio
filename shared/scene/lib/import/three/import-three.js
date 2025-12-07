import global from "../../../../constants/global/global";

export default async function importThree() {
  global.THREE = await import("three");
  global.THREE.GLTFLoader = (await import("three/addons/loaders/GLTFLoader")).GLTFLoader;
  global.THREE.OrbitControls = (await import("three/addons/controls/OrbitControls")).OrbitControls;
}