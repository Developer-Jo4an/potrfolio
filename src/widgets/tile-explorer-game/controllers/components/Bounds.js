import {Component} from "@shared";

export class Bounds extends Component {
  bounds;

  constructor({bounds = {}}) {
    super(...arguments);

    this.bounds = bounds;
  }

  destroy() {
    super.destroy();
    this.bounds = null;
  }
}
