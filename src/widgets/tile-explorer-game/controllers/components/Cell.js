import {Component} from "@shared";

export class Cell extends Component {
  id;

  type;

  x;

  y;

  z;

  isBlocked;

  isInsidePool;

  isResolved;

  constructor({id, x, y, z, isBlocked, type, isInsidePool, isResolved}) {
    super(...arguments);

    this.id = id;
    this.type = type;
    this.x = x;
    this.y = y;
    this.z = z;
    this.isBlocked = isBlocked;
    this.isInsidePool = isInsidePool;
    this.isResolved = isResolved;
  }

  destroy() {
    super.destroy();
    this.id = null;
    this.type = null;
    this.x = null;
    this.y = null;
    this.z = null;
    this.isBlocked = null;
    this.isInsidePool = null;
    this.isResolved = null;
  }
}
