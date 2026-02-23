import {Behaviour} from "./Behaviour";

export class Immunity extends Behaviour {
  apply() {
    const {system} = this;

    const {cImmunity} = system.getCharacterInfo();
    cImmunity.isActive = true;

    return super.apply();
  }

  clear() {
    const {system} = this;

    const {cImmunity} = system.getCharacterInfo();
    cImmunity.isActive = false;

    super.clear();
  }
}
