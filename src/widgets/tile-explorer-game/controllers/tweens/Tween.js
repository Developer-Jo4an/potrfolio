import {GAME} from "../constants/game";

export class Tween {
  storage;

  eventBus;

  vars;

  serviceData;

  tween;

  _resolve;

  _isResolved;

  _promise;

  constructor({storage, eventBus, vars, serviceData}) {
    this.storage = storage;
    this.eventBus = eventBus;
    this.vars = vars;
    this.serviceData = serviceData;
  }

  get promise() {
    return this._promise;
  }

  get resolve() {
    return this._resolve;
  }

  get isResolved() {
    return this._isResolved;
  }

  init() {
    const {
      vars: {onComplete},
    } = this;

    this._promise = new Promise((res) => {
      this._resolve = () => {
        if (this.isResolved) return;
        this._isResolved = true;
        onComplete?.();
        res();
      };
    });
  }

  start() {
    const {
      vars: {onStart},
      tween,
    } = this;

    onStart?.();
    tween.resume();
  }

  stop() {
    const {tween} = this;
    tween.pause();
  }

  pause() {
    this.stop();
  }

  resume() {
    const {tween} = this;
    tween.resume();
  }

  destroy() {
    const {tween} = this;

    tween.delete(GAME, false);
    this.resolve();
  }
}
