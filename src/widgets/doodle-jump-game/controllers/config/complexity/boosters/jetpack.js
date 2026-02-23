import {BOOSTER, Boosters, BoosterTextures} from "../../../entities/booster";

export const jetpack = () => ({
  type: BOOSTER,
  texture: BoosterTextures.JETPACK,
  size: {width: 30, height: 45},
  isTrackCollision: true,
  behaviour: {
    type: Boosters.JETPACK,
    props: {
      offset: {x: 0, y: -35},
      maxSpeed: -2500, // px / s
      acceleration: -3000,
      time: 8,
    },
  },
});
