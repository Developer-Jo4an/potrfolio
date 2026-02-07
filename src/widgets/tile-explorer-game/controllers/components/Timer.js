import {Component} from "@shared";

export class Timer extends Component {
  time;

  constructor({time = 60}) {
    super(...arguments);

    this.time = time;
  }

  destroy() {
    super.destroy();
    this.time = null;
  }
}
