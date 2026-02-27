import {Component} from "@shared";

export class Polygon extends Component {
  type = "polygon";

  polygon;

  angle = 0;

  constructor({polygon, angle}) {
    super(...arguments);

    this.polygon = polygon;
    this.angle = angle ?? this.angle;
  }

  destroy() {
    super.destroy();

    this.polygon = null;
    this.angle = null;
  }
}
