import {Component} from "../../../core/Component";

export class Tween extends Component {
  type = "tween";

  _tweens = new Map();

  get tweens() {
    return this._tweens;
  }

  add(tween, id) {
    this.tweens.set(id, tween);
  }

  remove(id) {
    this.tweens.delete(id);
  }

  get(id) {
    return this.tweens.get(id);
  }

  has(id) {
    return !!this.tweens.has(id);
  }

  removeAll() {
    for (const key of this.tweens.keys()) this.remove(key);
  }

  destroy() {
    super.destroy();
    this.removeAll();
    this._tweens = null;
  }
}
