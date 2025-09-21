import BaseEntity from "./BaseEntity";
import {upperFirst} from "lodash";
import {getIsDebug} from "../../../../../shared/lib/debug/debug";
import global from "../../../../../shared/constants/global/global";

export default class BasePhysicsEntity extends BaseEntity {

  static rememberFields = {
    setters: ["mass", "inertia"],
    fields: ["friction", "frictionAir", "frictionStatic", "restitution", "density"]
  };

  _body = null;

  _isGravity = true;

  savedPhysics = {};

  constructor(data) {
    super(data);

    this.basePhysicsInit();
  }

  get velocity() {
    const {body} = this;
    return body.velocity;
  }

  get body() {
    return this._body;
  }

  set body(body) {
    this._body = body;
    body.wrapperBody = this;
  }

  get position() {
    const {body} = this;
    return body.position;
  }

  set position({x = this.body.position.x, y = this.body.position.y}) {
    const {body} = this;
    const {Body} = global.Matter;
    Body.setPosition(body, {x, y});
  }

  get x() {
    return this.position.x;
  }

  set x(x) {
    this.position = {x};
  }

  get y() {
    return this.position.y;
  }

  set y(y) {
    this.position = {y};
  }

  get angle() {
    const {body} = this;
    return body.angle;
  }

  set angle(angle) {
    const {body} = this;
    const {Body} = global.Matter;
    Body.setAngle(body, angle ?? body.angle);
  }

  get isGravity() {
    return this._isGravity;
  }

  set isGravity(isGravity) {
    if (this.isGravity === isGravity) return;

    this._isGravity = isGravity;

    const callbackKey = isGravity ? "onActivateGravity" : "onDeactivateGravity";

    this[callbackKey]();
  }

  onActivateGravity() {
    const {body, isGravity} = this;
    const {Body} = global.Matter;

    Body.setStatic(body, !isGravity);

    for (const key in this.savedPhysics) {
      const value = this.savedPhysics[key];

      if (BasePhysicsEntity.rememberFields.setters.includes(key))
        Body[`set${upperFirst(key)}`](body, value);
      else
        body[key] = value;
    }

    this.savedPhysics = {};
  }

  onDeactivateGravity() {
    const {body, isGravity} = this;
    const {Body} = global.Matter;

    for (const key in BasePhysicsEntity.rememberFields) {
      const array = BasePhysicsEntity.rememberFields[key];
      array.forEach(key => this.savedPhysics[key] = body[key]);
    }

    Body.setStatic(body, !isGravity);
  }

  basePhysicsInit() {

  }

  addToWorld() {
    const {world, body} = this;
    const {World} = global.Matter;

    if (!this.body && getIsDebug())
      throw new Error("You can add a Body if you have a Body");

    if (!world.bodies.includes(body.body))
      World.add(world, body);
    else if (getIsDebug())
      console.warn("This body already in world");
  }

  update() {

  }

  delete() {
    const {body, world} = this;
    const {World} = global.Matter;

    World.remove(world, body);
  }
}
