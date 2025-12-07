export const mainSceneSettings = {
  character: {
    castShadow: true,
    receiveShadow: false,
    roughness: 0.75,
    metalness: 0.25,
    startData: {
      rotation: {
        x: 0,
        y: -Math.PI / 8,
        z: 0
      }
    }
  },

  ground: {
    width: 1000,
    height: 1000,
    rotation: {
      x: -Math.PI / 2,
      y: 0,
      z: 0
    },
    opacity: 0.3,
    castShadow: false,
    receiveShadow: true
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
        position: {x: 0, y: 0, z: 0}
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