import {Component} from "@shared";

export class Cell extends Component {
  x;

  y;

  z;

  constructor({x, y, z}) {
    super(...arguments);

    this.x = x;
    this.y = y;
    this.z = z;
  }

  destroy() {
    super.destroy();
    this.x = null;
    this.y = null;
    this.z = null;
  }
}
