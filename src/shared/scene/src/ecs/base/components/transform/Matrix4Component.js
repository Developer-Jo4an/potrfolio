import {Component} from "../../../core/Component";
import {Vector3} from "../../../../../../lib/src/math/Vector3";
import {Euler} from "../../../../../../lib/src/math/Euler";
import {Quaternion} from "../../../../../../lib/src/math/Quaternion";
import {isArray, isNumber, isObject} from "lodash";

export class Matrix4Component extends Component {
  _position = new Vector3(0, 0, 0);

  _rotation = new Euler(0, 0, 0);

  _quaternion = new Quaternion().setFromEuler(this.rotation);

  _scale = new Vector3(1, 1, 1);

  // position
  get position() {
    return this._position;
  }

  set position(value) {
    this._setVector3(this.position, value);
  }

  get x() {
    return this.position.x;
  }

  set x(value) {
    this.position.x = value;
  }

  get y() {
    return this.position.y;
  }

  set y(value) {
    this.position.y = value;
  }

  get z() {
    return this.position.z;
  }

  set z(value) {
    this.position.z = value;
  }

  // rotation
  get rotation() {
    return this._rotation;
  }

  set rotation(value) {
    const {_quaternion, rotation} = this;
    this._setVector3(rotation, value);
    _quaternion.setFromEuler(rotation);
  }

  get rotationX() {
    return this.rotation.x;
  }

  set rotationX(value) {
    this.rotation.x = value;
  }

  get rotationY() {
    return this.rotation.y;
  }

  set rotationY(value) {
    this.rotation.y = value;
  }

  get rotationZ() {
    return this.rotation.z;
  }

  set rotationZ(value) {
    this.rotation.z = value;
  }

  // quaternion
  get quaternion() {
    return this._quaternion;
  }

  set quaternion(value) {
    const {quaternion, _rotation} = this;
    this._setVector4(quaternion, value);
    _rotation.setFromQuaternion(quaternion);
  }

  get quaternionX() {
    return this.quaternion.x;
  }

  set quaternionX(value) {
    this.quaternion.x = value;
  }

  get quaternionY() {
    return this.quaternion.y;
  }

  set quaternionY(value) {
    this.quaternion.y = value;
  }

  get quaternionZ() {
    return this.quaternion.z;
  }

  set quaternionZ(value) {
    this.quaternion.z = value;
  }

  get quaternionW() {
    return this.quaternion.w;
  }

  set quaternionW(value) {
    this.quaternion.w = value;
  }

  // scale
  get scale() {
    return this._scale;
  }

  set scale(value) {
    this._setVector3(this.scale, value);
  }

  get scaleX() {
    return this.scale.x;
  }

  set scaleX(value) {
    this.scale.x = value;
  }

  get scaleY() {
    return this.scale.y;
  }

  set scaleY(value) {
    this.scale.y = value;
  }

  get scaleZ() {
    return this.scale.z;
  }

  set scaleZ(value) {
    this.scale.z = value;
  }

  // math
  _setVector3(vector, value) {
    if (isObject(value)) {
      const {x, y, z} = vector;
      vector.set(value.x ?? x, value.y ?? y, value.z ?? z);
    } else if (isArray(value)) {
      const {x, y, z} = vector;
      vector.set(value[0] ?? x, value[1] ?? y, value[2] ?? z);
    } else if (isNumber(value)) vector.set(value, value, value);
  }

  _setVector4(vector, value) {
    if (isObject(value)) {
      const {x, y, z, w} = vector;
      vector.set(value.x ?? x, value.y ?? y, value.z ?? z, value.w ?? w);
    } else if (isArray(value)) {
      const {x, y, z, w} = vector;
      vector.set(value[0] ?? x, value[1] ?? y, value[2] ?? z, value[3] ?? w);
    } else if (isNumber(value)) vector.set(value, value, value, value);
  }

  destroy() {
    super.destroy();
    this._position = null;
    this._rotation = null;
    this._quaternion = null;
    this._scale = null;
  }
}
