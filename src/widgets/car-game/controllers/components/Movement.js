import {Component} from "@shared";

export class Movement extends Component {
  type = "movement";

  angle = 0;

  acceleration = 0;

  currentSpeed = 0;

  minSpeed = 0;

  maxSpeed = 0;

  constructor({angle, acceleration, currentSpeed, minSpeed, maxSpeed}) {
    super(...arguments);

    this.angle = angle ?? this.angle;
    this.acceleration = acceleration ?? this.acceleration;
    this.currentSpeed = currentSpeed ?? this.currentSpeed;
    this.minSpeed = minSpeed ?? this.minSpeed;
    this.maxSpeed = maxSpeed ?? this.maxSpeed;
  }

  destroy() {
    super.destroy();

    this.angle = null;
    this.acceleration = null;
    this.currentSpeed = null;
    this.minSpeed = null;
    this.maxSpeed = null;
  }
}
