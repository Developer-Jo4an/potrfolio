import {ChangeTexture} from "./ChangeTexture";
import {CharacterTextures} from "../../entities/character";
import {Boosters} from "../../entities/booster";

export class SpringTexture extends ChangeTexture {
  apply() {
    const {system} = this;
    const {
      settings: {springSize},
    } = system.getCharacterInfo();

    return super.apply(CharacterTextures[Boosters.SPRING], springSize);
  }
}
