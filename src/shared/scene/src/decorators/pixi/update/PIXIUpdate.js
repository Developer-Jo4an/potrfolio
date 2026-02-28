import {Update} from "../../update/Update";

export class PIXIUpdate extends Update {
  static MIN_FPS = 38;

  fullTime = 0;

  constructor() {
    super(...arguments);

    this.update = this.update.bind(this);
  }

  get isStarted() {
    return this.ticker.started;
  }

  initDecorator() {
    const {ticker} = this;
    ticker.add(this.update);
    ticker.minFPS = PIXIUpdate.MIN_FPS;
  }

  startUpdate() {
    const {ticker} = this;
    ticker.start();
  }

  stopUpdate() {
    const {ticker} = this;
    ticker.stop();
  }

  getFullTime({deltaTime}) {
    return (this.fullTime += this.getDeltaS({deltaTime}));
  }

  getDeltaS({deltaTime}) {
    return deltaTime / 60;
  }

  update({deltaMS, deltaTime}) {
    const deltaS = this.getDeltaS(...arguments);
    const fullTime = this.getFullTime(...arguments);

    this.throwEvent({deltaMS, deltaTime, deltaS, fullTime});
  }

  reset() {
    this.fullTime = 0;
  }
}
