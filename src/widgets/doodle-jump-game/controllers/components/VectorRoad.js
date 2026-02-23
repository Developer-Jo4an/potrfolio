import {Component} from "@shared";

export class VectorRoad extends Component {
  type = "vectorRoad";

  x = 0;

  y = 0;

  constructor({x, y}) {
    super(...arguments);

    this.x = x ?? this.x;
    this.y = y ?? this.y;
  }

  destroy() {
    super.destroy();
    this.x = null;
    this.y = null;
  }
}
