import {BOOSTER, Boosters, BoosterTextures} from "../../../entities/booster";

export const propeller = () => ({
  type: BOOSTER,
  texture: BoosterTextures.PROPELLER,
  size: {width: 45, height: 20},
  isTrackCollision: true,
  behaviour: {
    type: Boosters.PROPELLER,
    props: {
      offset: {x: 0, y: -20},
      maxSpeed: -1500, // px / s
      acceleration: -2000,
      time: 6,
    },
  },
});
