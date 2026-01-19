import {assets, GLTF, TEXTURE} from "@shared";

export const SCENE_FROM_BLENDER = "Basketball";
export const BARRIER = "barrier";
export const CLOUD = "cloud";
export const TRAIL = "trail";
export const WIND = "wind";

export const preload = [
  {type: TEXTURE, name: BARRIER, src: assets(`basketball/${BARRIER}.png`)},
  {type: TEXTURE, name: CLOUD, src: assets(`basketball/${CLOUD}.png`)},
  {type: TEXTURE, name: TRAIL, src: assets(`basketball/${TRAIL}.png`)},
  {type: TEXTURE, name: WIND, src: assets(`basketball/${WIND}.png`)},
  {type: GLTF, name: SCENE_FROM_BLENDER, src: assets(`basketball/${SCENE_FROM_BLENDER}.gltf`)}
];