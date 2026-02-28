export const mainSceneSettings = {
  angle: [Math.PI / 4, (Math.PI / 4) * 3],

  actor: {
    width: 50,
    height: 89,
    x: 180,
    y: 800,
    acceleration: 200,
    minSpeed: 200,
    maxSpeed: 500,
  },
  roadChunk: {
    length: [500, 800],
    size: [150, 300],
    tileScale: 0.3,
  },
  camera: {
    trackBorderX: 180,
    trackBorderY: 600,
  },
};
