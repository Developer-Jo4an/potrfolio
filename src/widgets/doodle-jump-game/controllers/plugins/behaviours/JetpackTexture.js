import {ChangeTexture} from "./ChangeTexture";
import {CharacterTextures} from "../../entities/character";
import {Boosters} from "../../entities/booster";

export class JetpackTexture extends ChangeTexture {
  apply() {
    const {system} = this;
    const {
      settings: {jetpackSize},
    } = system.getCharacterInfo();

    return super.apply(CharacterTextures[Boosters.JETPACK], jetpackSize);
  }
}
