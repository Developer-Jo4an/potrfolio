import {Component} from "@shared";

export class Complexity extends Component {
  type = "complexity";

  config;

  last;

  active = 0;

  count = 0;

  constructor({config, active, count, last}) {
    super(...arguments);

    this.config = config;
    this.last = last;
    this.active = active ?? this.active;
    this.count = count ?? this.count;
  }

  destroy() {
    super.destroy();

    this.config = null;
    this.active = null;
    this.count = null;
    this.last = null;
  }
}
