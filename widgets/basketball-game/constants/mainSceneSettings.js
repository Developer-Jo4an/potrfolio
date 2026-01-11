import {CLEAR_HIT} from "./boosters";

export const mainSceneSettings = {
  world: {
    gravity: {
      x: 0, y: -9.81, z: 0
    },
    maxDeltaTime: 0.016
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
    startData: {
      rotation: {
        x: 0,
        y: -Math.PI / 8,
        z: 0
      },
      position: {
        x: 0,
        y: 0,
        z: 0
      }
    },
    movement: {
      clamp: {
        x: [-Infinity, Infinity],
        y: [0, Infinity],
        z: [-Infinity, Infinity]
      }
    },
    throw: {
      duration: 1,
      speed: {
        s: 1.5,
        m: 4.5,
        l: 5.5,
        xl: 20
      },
      angvel: {
        x: 8,
        y: 0,
        z: 0
      }
    }
  },

  ground: {
    width: 1000,
    height: 1,
    depth: 1000,
    opacity: 0.3,
    friction: 0,
    restitution: 1.25,
    castShadow: false,
    receiveShadow: true
  },

  boosters: {
    [CLEAR_HIT]: {
      time: 1
    }
  },

  ring: {
    transparent: true,
    startData: {
      position: {x: 0, y: 1.2, z: -5}
    },
    grid: {
      height: 0.175,
      radsProportion: 0.7,
      radialSegments: 32,
      heightSegments: 32,
      openEnded: true,
      thetaStart: -Math.PI * 1.5 / 2,
      thetaLength: Math.PI * 1.5,
      restitution: 0,
      friction: 0
    },
    sensor: {
      radius: 0.02,
      translation: [0, -0.15, 0]
    },
    geometryRotation: {x: Math.PI / 2, y: 0, z: 0},
    tube: 0.015
  },

  camera: {
    position: {
      x: 0, y: 0.5, z: 3.25
    },
    target: {
      x: 0, y: 0.5, z: 0
    }
  },

  lights: {
    ambient: {
      color: "#ffffff",
      intensity: 1
    },
    directional: {
      color: "#ffffff",
      intensity: 2.5,
      position: {x: 5, y: 7, z: 5},
      target: {
        position: {x: 0, y: 0, z: 0},
        name: "directionalLightTarget"
      },
      castShadow: true,
      rectangle: {
        left: -5,
        right: 5,
        top: 5,
        bottom: -5,
        width: 2048,
        height: 2048
      }
    }
  }
};