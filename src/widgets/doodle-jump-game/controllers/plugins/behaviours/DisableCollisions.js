import {Behaviour} from "./Behaviour";

export class DisableCollisions extends Behaviour {
  apply() {
    const {system} = this;
    const {cCollider} = system.getCharacterInfo();

    cCollider.isTrackCollision = false;

    return super.apply();
  }

  clear() {
    const {system} = this;
    const {cCollider} = system.getCharacterInfo();

    cCollider.isTrackCollision = true;

    super.clear();
  }
}
