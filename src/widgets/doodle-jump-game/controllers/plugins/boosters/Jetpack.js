import {Booster} from "./Booster";
import {Behaviours} from "../../constants/behaviours";

export class Jetpack extends Booster {
  createConfig({
    cBehaviour: {
      data: {time},
    },
  }) {
    {
      const {
        storage: {
          mainSceneSettings: {savedTimeAfterEffects},
        },
      } = this;

      return {
        resolveTime: time,
        config: [
          {type: Behaviours.APPLY_IMMUNITY, time: time + savedTimeAfterEffects},
          {type: Behaviours.DISABLE_COLLISIONS, time},
          {type: Behaviours.APPLY_JETPACK_TEXTURE, time},
        ],
      };
    }
  }
}
