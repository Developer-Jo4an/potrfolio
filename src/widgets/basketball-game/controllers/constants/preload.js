import {assets, GLTF, TEXTURE} from "@shared";

export const SCENE_FROM_BLENDER = "basketball";
export const TRAIL = "trail";

export const preload = [
  {type: TEXTURE, name: TRAIL, src: assets(`basketball/${TRAIL}.png`)},
  {type: GLTF, name: SCENE_FROM_BLENDER, src: assets(`basketball/${SCENE_FROM_BLENDER}.gltf`)},
];
