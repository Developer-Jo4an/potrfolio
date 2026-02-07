import {Component} from "@shared";

export class Tween extends Component {
  _tweens = new Map();

  get tweens() {
    return this._tweens;
  }

  add(tween, id) {
    const {tweens} = this;
    tweens.set(id, tween);
  }

  remove(id) {
    this.tweens.delete(id);
  }

  get(id) {
    const {tweens} = this;
    return tweens.get(id);
  }

  has(id) {
    const {tweens} = this;
    return tweens.has(id);
  }

  removeAll(isDestroy = true) {
    for (const key of this.tweens.keys()) this.remove(key, isDestroy);
  }

  destroy() {
    super.destroy();
    this.removeAll(true);
    this._tweens = null;
  }
}
