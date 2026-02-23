import {Component} from "../../core/Component";

export class SatCollider extends Component {
  type = "satCollider";

  /**
   * @type {CollisionGroup}
   */
  group;

  /**
   * @type {Collider}
   */
  collider;

  prevResponse = {};

  response = {};

  isActive = true;

  isTrackCollision = true;

  _prevX;

  _prevY;

  _prevAngle;

  constructor({collider, prevResponse, response, group, isActive, isTrackCollision}) {
    super(...arguments);

    this.collider = collider;
    this.group = group;
    this.prevResponse = prevResponse ?? this.prevResponse;
    this.response = response ?? this.response;
    this.isActive = isActive ?? this.isActive;
    this.isTrackCollision = isTrackCollision ?? this.isTrackCollision;
  }

  get prevX() {
    return this._prevX;
  }

  get x() {
    const {collider} = this;
    return collider?.pos.x;
  }

  set x(x) {
    const {collider} = this;

    if (collider) {
      this._prevX = collider.pos.x;
      collider.pos.x = x;
    }
  }

  get prevY() {
    return this._prevY;
  }

  get y() {
    const {collider} = this;
    return collider?.pos.y;
  }

  set y(y) {
    const {collider} = this;

    if (collider) {
      this._prevY = collider.pos.y;
      collider.pos.y = y;
    }
  }

  get prevAngle() {
    return this._prevAngle;
  }

  get angle() {
    const {collider} = this;
    return collider?.angle;
  }

  set angle(angle) {
    const {collider} = this;

    if (collider) {
      this._prevAngle = collider.angle;
      collider.setAngle(angle);
    }
  }

  destroy() {
    super.destroy();
    this.collider = null;
    this.group = null;
    this.prevResponse = null;
    this.response = null;
    this.isActive = null;
    this.isTrackCollision = null;
    this._prevX = null;
    this._prevY = null;
    this._prevAngle = null;
  }
}

/**
 * @typedef {string | number | undefined | null} CollisionGroup
 */

/**
 * @typedef {Object | undefined | null} Collider
 * @description - экземпляр класса SAT.Polygon
 */
