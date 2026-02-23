export const mainSceneSettings = {
  timeScale: 0.675,
  loseBorder: 1000,
  spawnBorder: -200,
  savedTimeAfterEffects: 1,
  fallDistance: 1500,

  character: {
    size: {width: 50, height: 50},
    propellerSize: {width: 50, height: 62},
    springSize: {width: 50, height: 60},
    jetpackSize: {width: 70, height: 72},
    loseSize: {width: 55, height: 62},
    jumpForce: -960,

    speed: {
      tap: {
        forLinearMovement: 600,
        forAcceleratedMovement: 1320,
        speedEPS: 1.2
      },
      gyroscope: {
        multiplier: 60,
        max: 1000
      }
    },
    collision: {
      enemy: {
        overlapLength: 20
      },
      platform: {
        overlapLength: 10
      }
    }
  },

  platform: {
    start: {
      position: {
        x: 180,
        y: 650
      },
      type: "standard"
    },
    width: 70,
    height: 14
  },

  camera: {
    clamp: {
      min: 0.65,
      max: 0.925
    }
  },

  enemy: {
    static: {
      size: 60,
      offsetFromPlatform: {
        x: 0,
        y: -10
      },
      offsetFromSisterPlatform: {
        y: {min: -5, max: 5}
      }
    },
    moving: {
      size: 60
    }
  },

  bullet: {
    speed: 2000, // px/s*60
    size: {
      width: 12,
      height: 12
    }
  },

  clips: {
    character: {
      propeller: {
        speed: 0.3,
        loop: true
      },
      jetpack: {
        speed: 0.3,
        loop: true
      },
      lose: {
        speed: 0.3,
        loop: true
      }
    },
    enemy0: {
      speed: 0.05,
      loop: true
    },
    enemy1: {
      speed: 0.2,
      loop: true
    },
    enemy2: {
      speed: 1,
      loop: true
    },
    enemy3: {
      speed: 1,
      loop: true
    },
    platform1: {
      speed: 0.4,
      loop: false
    }
  }
};
