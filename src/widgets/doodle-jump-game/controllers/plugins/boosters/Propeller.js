import {Booster} from "./Booster";
import {Behaviours} from "../../constants/behaviours";

export class Propeller extends Booster {
  createConfig({
    cBehaviour: {
      data: {time},
    },
  }) {
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
        {type: Behaviours.APPLY_PROPELLER_TEXTURE, time},
      ],
    };
  }
}
