import {Component} from "../../../core/Component";

export class GSAPTween extends Component {
  tweens = new Map();

  has(id) {
    const {tweens} = this;
    return tweens.has(id);
  }

  get(id) {
    const {tweens} = this;
    return tweens.get(id);
  }

  add(tween) {
    const {tweens} = this;
    tweens.set(tween.vars.id, tween);
  }

  remove(id, toKill = true) {
    const tween = this.get(id);
    if (!tween) return;

    toKill && tween.kill();

    const {tweens} = this;
    tweens.delete(id);
  }

  destroy() {
    super.destroy();
    this.tweens = null;
  }
}