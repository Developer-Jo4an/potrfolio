export const mainSceneSettings = {
  "character": {
    "anchor": [
      0.5,
      0.5
    ],
    "width": 30,
    "height": 62,
    "startPosition": {
      "x": 180,
      "y": 750
    },
    "speed": 5,
    "velocity": 0.015,
    "moduleAngle": 0.785,
    "zIndex": 2,
    "rotationFromDirection": {
      "left": -0.785,
      "right": 0.785
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
  "roadChunks": {
    "generate": {
      "count": 6,
      "minStartCount": 10,
      "minCountForGenerate": 8
    },
    "width": {
      "min": 140,
      "max": 180
    },
    "sparePoint": {
      "x": 180,
      "y": 800
    },
    "hypotMultipliers": {
      "min": 0.3,
      "max": 1
    },
    "anchor": [
      0.5,
      1
    ],
    "addedAngle": {
      "left": {
        "x": -1.57,
        "y": 0
      },
      "right": {
        "x": 0,
        "y": -1.57
      }
    }
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
