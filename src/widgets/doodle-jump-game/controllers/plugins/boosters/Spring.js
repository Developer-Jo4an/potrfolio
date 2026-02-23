import {Booster} from "./Booster";
import {Behaviours} from "../../constants/behaviours";

export class Spring extends Booster {
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
          {type: Behaviours.APPLY_SPRING_TEXTURE, time},
        ],
      };
    }
  }
}
