import {ChangeTexture} from "./ChangeTexture";
import {CharacterTextures} from "../../entities/character";

export class LoseTexture extends ChangeTexture {
  apply() {
    const {system} = this;
    const {
      settings: {loseSize},
      cCollider,
    } = system.getCharacterInfo();
    cCollider.isActive = false;
    return super.apply(CharacterTextures.LOSE, loseSize);
  }

  clear() {
    const {system} = this;
    const {cCollider} = system.getCharacterInfo();
    cCollider.isActive = true;
    return super.clear();
  }
}
