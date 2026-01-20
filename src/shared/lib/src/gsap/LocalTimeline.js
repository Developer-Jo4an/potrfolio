import {isString, isFinite} from "lodash";

export const PLAYING = "playing";
export const PAUSED = "paused";

export class LocalTimeline {
  static statuses = {playing: PLAYING, paused: PAUSED};

  _spaces = {};

  static get instance() {
    if (this._instance) return this._instance;
    const localTimeline = (this._instance = new LocalTimeline());
    localTimeline.register();
    return localTimeline;
  }

  get spaces() {
    return this._spaces;
  }

  register() {
    gsap.localTimeline = this;

    const Animation = gsap.core.Animation;

    const self = this;

    Animation.prototype.save = function (namespace, id) {
      self.add(namespace, this);
      (isString(id) || isFinite(id)) && (this.tweenId = id);
      return this;
    };

    Animation.prototype.delete = function (namespace, toKill = true) {
      self.delete(namespace, this, toKill);
      return this;
    };
  }

  checkOnSpaceExist(namespace) {
    const {spaces} = this;

    if (!spaces[namespace]) {
      spaces[namespace] = {arr: [], status: LocalTimeline.statuses.playing};
      console.log(`new gsap space created: ${namespace}`);
    }
  }

  setStatus(namespace, status) {
    this.checkOnSpaceExist(namespace);

    this.spaces[namespace].status = status;
  }

  clear(namespace, toKill = true, progress = 0) {
    const tweens = this.getTweensByNamespace(namespace);

    toKill &&
      tweens.forEach((tween) => {
        tween.progress(progress);
        this.killTween(tween);
      });

    this.spaces[namespace].arr = [];
  }

  add(namespace, tween) {
    const currentStatus = this.getStatusByNamespace(namespace);

    tween[{playing: "resume", paused: "pause"}[currentStatus]]?.();

    const tweens = this.getTweensByNamespace(namespace);

    tweens.push(tween);
  }

  isExist(namespace, id) {
    const tweens = this.getTweensByNamespace(namespace);

    return tweens.some((tween) => tween.tweenId === id);
  }

  getTweenByNamespaceAndId(namespace, id) {
    const tweens = this.getTweensByNamespace(namespace);

    return tweens.find((tween) => tween.tweenId === id);
  }

  delete(namespace, tween, toKill) {
    let tweens;
    if (namespace) tweens = this.getTweensByNamespace(namespace);
    else {
      const [namespaceId, currentSpace] = Object.entries(this.spaces).find(([, {arr}]) =>
        arr.some((insideSpaceTween) => insideSpaceTween === tween),
      );
      tweens = currentSpace.arr;
      namespace = namespaceId;
    }

    if (!tweens || !namespace) return;

    toKill && this.killTween(tween);

    this.spaces[namespace].arr = tweens.filter((insideSpaceTween) => insideSpaceTween !== tween);
  }

  discontinue(namespace, id, toKill = true, toComplete = false) {
    const tweens = this.getTweensByNamespace(namespace);

    const necessaryTween = tweens.find((tween) => tween.tweenId === id);

    if (!necessaryTween) return;

    toComplete && necessaryTween.progress(1);
    toKill && this.killTween(necessaryTween);

    this.spaces[namespace].arr = tweens.filter((insideSpaceTween) => insideSpaceTween !== necessaryTween);
  }

  pause(namespace) {
    const tweens = this.getTweensByNamespace(namespace);

    tweens.forEach((tween) => tween.pause());

    this.setStatus(namespace, LocalTimeline.statuses.paused);
  }

  play(namespace) {
    const tweens = this.getTweensByNamespace(namespace);

    tweens.forEach((tween) => tween.resume());

    this.setStatus(namespace, LocalTimeline.statuses.playing);
  }

  killTween(tween) {
    if (tween.isKilled) {
      console.warn(tween, "Twin that is killed cannot be killed.");
      return;
    }

    if (tween.paused()) tween.resume();

    tween.kill();
    tween.isKilled = true;
  }

  getTweensByNamespace(namespace) {
    this.checkOnSpaceExist(namespace);
    return this.spaces[namespace]?.arr;
  }

  getStatusByNamespace(namespace) {
    this.checkOnSpaceExist(namespace);
    return this.spaces[namespace]?.status;
  }
}
