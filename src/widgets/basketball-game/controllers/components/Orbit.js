import {Component} from "@shared";

export class Orbit extends Component {
  center;

  radius;

  angle;

  angularVelocity;

  normal;

  tangent1;

  tangent2;

  constructor(
    {
      center = {x: 0, y: 0, z: 0},
      radius = 1,
      angle = 0,
      angularVelocity = 0,
      normal = {x: 1, y: 0, z: 0},
      tangent1 = {x: 1, y: 0, z: 0},
      tangent = {x: 0, y: 0, z: 1}
    }) {
    super(...arguments);

    this.center = center;
    this.radius = radius;
    this.angle = angle;
    this.angularVelocity = angularVelocity;
    this.tangent1 = tangent1;
    this.tangent2 = tangent;
  }

  destroy() {
    super.destroy();
    this.center = null;
    this.radius = null;
    this.angle = null;
    this.angularVelocity = null;
    this.normal = null;
    this.tangent1 = null;
    this.tangent2 = null;
  }
}