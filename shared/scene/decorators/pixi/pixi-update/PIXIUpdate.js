import Update from "../../update/Update";

export default class PIXIUpdate extends Update {
  constructor(data) {
    super(data);

    this.update = this.update.bind(this);
  }

  get isStarted() {
    return this.ticker.started;
  }

  initDecorator() {
    const {ticker} = this;
    ticker.add(this.update);
  }

  startUpdate() {
    const {ticker} = this;
    ticker.start();
  }

  stopUpdate() {
    const {ticker} = this;
    ticker.stop();
  }

  update({deltaMS, deltaTime}) {
    this.throwEvent({deltaMS, deltaTime});
  }
}