import {Component} from "@shared";

export class Movement extends Component {
  type = "movement";

  angle = 0;

  constructor({angle}) {
    super(...arguments);

    this.angle = angle ?? 0;
  }

  destroy() {
    super.destroy();

    this.angle = null;
  }
}
