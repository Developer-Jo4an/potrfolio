import Component from "../../../core/Component";

export default class GSAPTween extends Component {
  tweens = [];

  has(id) {
    const {tweens} = this;
    return tweens.some(tween => tween.id === id);
  }

  get(id) {
    const {tweens} = this;
    return tweens.find(tween => tween.id === id);
  }

  add(tween) {
    const {tweens} = this;
    tweens.push(tween);
  }

  remove(id, toKill = true) {
    const {tweens} = this;
    const index = tweens.findIndex(tween => tween.id === id);
    const [necessaryTween] = tweens.splice(index, 1);
    toKill && necessaryTween.kill();
  }

  destroy() {
    super.destroy();
    this.tweens = null;
  }
}