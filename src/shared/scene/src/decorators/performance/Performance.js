import {BaseDecorator} from "../base/BaseDecorator";

export class Performance extends BaseDecorator {
  constructor(data) {
    super(data);

    this.update = this.update.bind(this);
  }

  async initDecorator() {
    const {default: Stats} = await import("stats.js");
    const stats = this.stats = new Stats();
    document.body.appendChild(stats.dom);
  }

  update() {
    const {stats} = this;

    if (!stats) return;

    stats.end();
    stats.begin();
  }
}