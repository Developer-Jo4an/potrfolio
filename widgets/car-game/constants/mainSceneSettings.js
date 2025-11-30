export const mainSceneSettings = {
  "character": {
    "anchor": [
      0.5,
      0.5
    ],
    "width": 50,
    "height": 70.8,
    "startPosition": {
      "x": 180,
      "y": 750
    },
    "speed": 5,
    "velocity": 0.015,
    "zIndex": 2,
    "rotationFromDirection": {
      "left": -0.785, // [-Math.PI/2, 0]
      "right": 0.785 //  [0, Math.PI/2]
    },
    "directionMultiplier": {
      "left": {
        "x": -1,
        "y": 1
      },
      "right": {
        "x": 1,
        "y": -1
      }
    }
  },
  "camera": {
    "trackingBoundary": 600
  },
  "roadChunksContainer": {
    "isRenderGroup": true
  },
  "roadChunks": {
    "generate": {
      "count": 6,
      "minStartCount": 10,
      "minCountForGenerate": 8
    },
    "width": {
      "min": 250,
      "max": 350
    },
    "height": {
      "min": 250,
      "max": 850
    },
    "tileScale": {
      "x": 0.4,
      "y": 0.4
    },
    "sparePoint": {
      "x": 180,
      "y": 800
    },
    "anchor": [
      0.5,
      1
    ]
  },
  "bonus": {
    "chance": 1,
    "zIndex": 1,
    "width": 30,
    "height": 30,
    "anchor": [
      0.5,
      0.5
    ]
  },
  "spike": {
    "chance": 1,
    "zIndex": 1,
    "width": 30,
    "height": 30,
    "anchor": [
      0.5,
      0.5
    ]
  }
};
