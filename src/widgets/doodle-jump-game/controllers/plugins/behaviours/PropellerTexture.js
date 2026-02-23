import {ChangeTexture} from "./ChangeTexture";
import {CharacterTextures} from "../../entities/character";
import {Boosters} from "../../entities/booster";

export class PropellerTexture extends ChangeTexture {
  apply() {
    const {system} = this;
    const {
      settings: {propellerSize},
    } = system.getCharacterInfo();

    return super.apply(CharacterTextures[Boosters.PROPELLER], propellerSize);
  }
}
