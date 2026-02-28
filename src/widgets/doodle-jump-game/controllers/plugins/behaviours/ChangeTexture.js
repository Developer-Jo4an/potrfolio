import {Character} from "../../config/factory/Character";
import {Behaviour} from "./Behaviour";

export class ChangeTexture extends Behaviour {
  apply() {
    this.applyTexture(...arguments);
    return super.apply();
  }

  clear() {
    const {system} = this;
    const {
      settings: {size},
    } = system.getCharacterInfo();

    this.changeTexture(Character.clips.IDLE, size);
    this.changeCollider();

    super.clear();
  }

  applyTexture(clipName, newSize) {
    this.changeTexture(clipName, newSize);
    this.changeCollider();
  }

  changeTexture(clipName, newSize) {
    const {system} = this;
    const {view, cMatrix} = system.getCharacterInfo();

    const clip = view.getChildByLabel(clipName);

    view.children.forEach((child) => {
      const isEqualClip = child === clip;
      child.visible = isEqualClip;
      child.scale.set(+isEqualClip);
      isEqualClip ? child.gotoAndPlay(0) : child.gotoAndStop(0);
    });

    view.scale.set(1);
    const scaleX = (cMatrix.scaleX = newSize.width / view.width);
    const scaleY = (cMatrix.scaleY = newSize.height / view.height);
    view.scale.set(scaleX, scaleY);
  }

  changeCollider() {
    const {system} = this;
    const {view, cMatrix, cCollider} = system.getCharacterInfo();
    cCollider.collider = system.createCollider(cMatrix.x, cMatrix.y, view.width, view.height);
  }
}
