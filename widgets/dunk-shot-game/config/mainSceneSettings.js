export const mainSceneSettings = {
  "ball": {
    "radius": 25,
    "physicalSettings": {
      "label": "ball",
      "restitution": 0.6,
      "friction": 0.3,
      "frictionAir": 0.015,
      "inertia": 300,
      "mass": 0.6
    }
  },
  "basket": {
    "circles": {
      "array": [
        {
          "angle": 3.14,
          "distanceMultiplier": 0.5,
          "extraProps": {
            "friction": 0.2,
            "restitution": 0,
            "isStatic": true,
            "label": "basket"
          }
        }, {
          "angle": 0,
          "distanceMultiplier": 0.5,
          "extraProps": {
            "friction": 0.2,
            "restitution": 0,
            "isStatic": true,
            "label": "basket"
          }
        }, {
          "angle": -4.71,
          "distanceMultiplier": 0.2,
          "isSensor": true,
          "extraProps": {
            "isStatic": true,
            "isSensor": true,
            "label": "basketSensor"
          }
        }, {
          "angle": -3.925,
          "distanceMultiplier": 0.39,
          "extraProps": {
            "friction": 0.2,
            "restitution": 0,
            "isStatic": true,
            "label": "basket"
          }
        }, {
          "angle": 0.785,
          "distanceMultiplier": 0.39,
          "extraProps": {
            "friction": 0.2,
            "restitution": 0,
            "isStatic": true,
            "label": "basket"
          }
        }, {
          "angle": 1.57,
          "distanceMultiplier": 0.38,
          "extraProps": {
            "friction": 0.2,
            "restitution": 0,
            "isStatic": true,
            "label": "basket"
          }
        }
      ],
      "distanceBetween": 95,
      "radius": 5
    },
    "caught": {
      "degreeOfStretch": 1.3,
      "rotationDuration": {
        "min": 0.35,
        "max": 0.5,
        "multiplier": 0.51
      },
      "minVelocity": 2.5
    },
    "magnet": {
      "multiplier": 0.45,
      "minDistance": 5
    },
    "textureTypes": {
      "burningBasket": "Burning",
      "ethernalBasket": "Eternal"
    },
    "entitiesTypes": {
      "burning_basket": "burningBasket",
      "ethernal_basket": "ethernalBasket"
    },
    "rotation": {
      "speedIntervals": [
        6, 5, 4, 3, 2
      ]
    },
    "gridBack": {
      "width": 90,
      "positionMultiplier": {
        "x": 0,
        "y": -0.2
      }
    },
    "back": {
      "width": 95
    },
    "gridFront": {
      "width": 95
    },
    "front": {
      "width": 95
    }
  },
  "spike": {
    "textureTypes": {
      "spike": "spike"
    },
    "entitiesTypes": {
      "spike": "spike"
    },
    "view": {
      "width": 65,
      "height": 41.5
    },
    "body": {
      "width": 58.5,
      "height": 37.35,
      "physicalSettings": {
        "friction": 0.2,
        "restitution": 0,
        "isStatic": true,
        "label": "spike"
      }
    },
    "movement": {
      "left": [
        "center"
      ],
      "center": [
        "left", "right"
      ],
      "right": [
        "center"
      ]
    },
    "speedIntervals": [
      3.5, 3, 2.5, 2, 1.5
    ]
  },
  "grid": {
    "padding": {
      "left": 0,
      "right": 0,
      "top": 0,
      "bottom": 130
    },
    "segments": {
      "left": {
        "name": "left",
        "bounding": {
          "x": 0,
          "widthMultiplier": 0.35,
          "heightMultiplier": 0.145
        }
      },
      "center": {
        "name": "center",
        "bounding": {
          "x": 0.35,
          "widthMultiplier": 0.3,
          "heightMultiplier": 0.145
        }
      },
      "right": {
        "name": "right",
        "bounding": {
          "x": 0.65,
          "widthMultiplier": 0.35,
          "heightMultiplier": 0.145
        }
      }
    }
  },
  "wings": {
    "view": {
      "width": 35,
      "height": 35
    }
  },
  "states": {
    "prepare": {
      "showingOffset": {
        "x": 0,
        "y": -125
      }
    },
    "fell": {
      "showingOffset": {
        "x": 0,
        "y": -125
      }
    },
    "restartField": {
      "showingOffset": {
        "x": 0,
        "y": -125
      }
    }
  },
  "throw": {
    "stretch": {
      "max": 150,
      "addedValue": 0.15,
      "subtractValue": 0.1,
      "minStretchValue": 0.25
    },
    "power": {
      "angular": 0.2,
      "linear": 0.05
    },
    "accuracy": 3
  },
  "layers": [
    {
      "id": "back"
    }, {
      "id": "middle"
    }, {
      "id": "front"
    }, {
      "id": "debug"
    }
  ],
  "camera": {
    "validRectangle": {
      "x": 0,
      "width": 360,
      "y": 300,
      "height": 200,
      "threshold": 5
    },
    "speed": {
      "min": 0,
      "max": 5.5
    },
    "borderDistance": 20
  },
  "wall": {
    "left": {
      "params": [
        -50, 0, 100, 9999999, {
          "isStatic": true,
          "label": "left",
          "restitution": 0.3,
          "friction": 0.2
        }
      ]
    },
    "right": {
      "params": [
        410, 0, 100, 9999999, {
          "isStatic": true,
          "label": "right",
          "restitution": 0.3,
          "friction": 0.2
        }
      ]
    }
  },
  "finish": {
    "width": 75,
    "height": 75,
    "offset": {
      "x": -45,
      "y": -30
    }
  },
  "aim": {
    "points": {
      "updateCount": 20,
      "count": 10,
      "size": {
        "min": 5,
        "max": 8
      }
    }
  },
  "boosters": {
    "wings": {
      "animation": {
        "offset": {
          "ballStartPosition": {
            "x": 0,
            "y": -60
          },
          "wingsStartPosition": {
            "left": -15,
            "right": 15
          }
        },
        "wingsAcceleration": 4,
        "tweenPoint": {
          "xMultiplier": 0.25,
          "yMultiplier": -0.125
        }
      }
    }
  },
  "update": {
    "threshold": 0.001
  }
};
