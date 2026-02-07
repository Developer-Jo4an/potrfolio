import {PI2} from "@shared";

export const MAIN_SCENE_SETTINGS = {
  shifts: {
    honest: [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1]
    ],
    odd: [
      [0, 0],
      [0, -1],
      [-1, 0],
      [-1, -1]
    ]
  },
  cell: {
    anchor: 0.5,
    size: 80,
    signSizeMultiplier: 0.8,
    tint: {
      visible: "#ffffff",
      invisible: "#bcbbbb"
    },
    animations: {
      idle: {
        s: 1000,
        m: 5000,
        l: 8000
      }
    },
    animationThreshold: 2
  },
  grid: {
    size: 340,
    paddingTop: 120
  },
  shelf: {
    margin: 10,
    padding: 10,
    gap: 5,
    cagesCount: 7,
    position: {x: 10, y: 600},
    target: 3,
    cage: {
      size: 90
    }
  },
  engGameWaiting: 2000,
  snow: {
    tween: {
      duration: 12,
      rotation: PI2 * 2,
      ease: "none"
    },
    curveSettings: {
      pointsCount: 4,
      tension: 0.1,
      closed: false,
      curveType: "centripetal",
      curviness: 30
    },
    sprite: {
      size: 20,
      count: 30
    }
  }
};
