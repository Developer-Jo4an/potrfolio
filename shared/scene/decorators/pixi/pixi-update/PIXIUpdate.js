import Update from "../../update/Update";

export default class PIXIUpdate extends Update {
  constructor(data) {
    super(data);

    this.update = this.update.bind(this);
  }

  initDecorator() {
    const {controller: {ticker}} = this;
    ticker.add(this.update);
  }

  startUpdate() {
    const {controller: {ticker}} = this;
    ticker.start();
  }

  stopUpdate() {
    const {controller: {ticker}} = this;
    ticker.stop();
  }

  update({elapsedMs, deltaTime}) {
    this.throwEvent(elapsedMs, deltaTime);
  }
}