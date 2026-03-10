import {CLEAR_HIT, EXTRA_LIFE, X2} from "./boosters";
import {X2VIEW} from "./x2View";

export const mainSceneSettings = {
  world: {
    gravity: {x: 0, y: -9.81, z: 0},
    maxDeltaTime: 0.016,
    multiplier: 1.2,
  },

  character: {
    transparent: true,
    castShadow: true,
    receiveShadow: false,
    roughness: 0.75,
    metalness: 0.25,
    opacity: 1,
    restitution: 0.25,
    friction: 0.4,
    linearDamping: 0,
    angularDamping: 0,
    startData: {rotation: {x: 0, y: -Math.PI / 8, z: 0}, position: {x: 0, y: 0, z: 0}},
    movement: {clamp: {x: [-Infinity, Infinity], y: [0, Infinity], z: [-Infinity, Infinity]}},
    throw: {
      duration: 1.25,
      dragEventCountForThrow: 3,
      vectorHelp: 4,
      speedHelp: 2,
      minSpeed: 0.75,
      speedInterpolation: 2,
      multiplier: [0.6, 1.3],
      angvel: {x: 12, y: 0, z: 0},
    },
  },

  ground: {
    width: 1000,
    height: 1,
    depth: 1000,
    depthTest: false,
    renderOrder: -1,
    opacity: 0.3,
    friction: 0,
    restitution: 1.25,
    castShadow: false,
    receiveShadow: true,
  },

  boosters: {
    [CLEAR_HIT]: {time: 1.35},
    [EXTRA_LIFE]: {},
    [X2]: {
      angularVelocity: 80,
      count: 10,
      offsetRadius: 0.1,
      velocity: {min: 60, max: 120},
    },
  },

  ring: {
    transparent: true,
    startData: {position: {x: 0, y: 2.5, z: -8}},
    sensor: {radius: 0.02, translation: [0, -0.125, 0]},
    tube: 0.015,
  },

  camera: {position: {x: 0, y: 0.98, z: 3.7}, fov: 50},

  lights: {
    ambient: {color: "#ffffff", intensity: 1},
    directional: {
      color: "#ffffff",
      intensity: 2.5,
      position: {x: 5, y: 7, z: 5},
      target: {position: {x: 0, y: 0, z: 0}, name: "directionalLightTarget"},
      castShadow: true,
      rectangle: {left: -5, right: 5, top: 5, bottom: -5, width: 2048, height: 2048},
    },
  },

  factory: {prepareList: Array.from({length: 10}).fill({type: X2VIEW})},
};
