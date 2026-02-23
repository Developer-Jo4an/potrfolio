import {HELPER, Helpers, HelperTextures} from "../../../entities/helper";

export const trampoline = () => ({
  type: HELPER,
  texture: HelperTextures.TRAMPOLINE,
  size: {width: 60, height: 22},
  isTrackCollision: true,
  behaviour: {
    type: Helpers.TRAMPOLINE,
    props: {
      offset: {x: 0, y: -21},
      jumpForceMultiplier: 1.7,
    },
  },
});
