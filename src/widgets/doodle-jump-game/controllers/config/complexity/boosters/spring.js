import {BOOSTER, Boosters, BoosterTextures} from "../../../entities/booster";

export const spring = () => ({
  type: BOOSTER,
  texture: BoosterTextures.SPRING,
  size: {width: 35, height: 25},
  isTrackCollision: true,
  behaviour: {
    type: Boosters.SPRING,
    props: {
      time: 8,
      jumpForceMultiplier: 1.7,
      offset: {x: 0, y: -22.5},
    },
  },
});
