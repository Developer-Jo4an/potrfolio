import {getEventPosition, eventSubscription} from "../../../../lib";
import {END, MOVE, START} from "../../../../constants";

export class CameraFlying {
  static ALL_KEYS = ["w", "s"];

  static SENS = 0.785;

  static SPEED = 4;

  _isActive = false;

  isInitialized = false;

  frameData = {timestamp: null, frame: null};

  keyboardData = CameraFlying.ALL_KEYS.reduce((acc, key) => {
    acc[key] = false;
    return acc;
  }, {});

  cameraData = {direction: null, screenPrev: null, offset: null};

  serviceData = {clearFunctions: []};

  constructor({storage}) {
    this.storage = storage;

    this.update = this.update.bind(this);
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  async init() {
    global.KeyboardJS = await import("keyboardjs");
    this.isInitialized = true;
  }

  get isActive() {
    return this._isActive;
  }

  set isActive(isActive) {
    if (!this.isInitialized) {
      console.warn("isInitialized false waiting for initialize before activate");
      return;
    }

    if (isActive === this._isActive) {
      console.warn("isActive is equal this._active", `isActive: ${isActive}`);
      return;
    }

    this._isActive = isActive;

    if (isActive) {
      const {serviceData, frameData, keyboardData} = this;

      CameraFlying.ALL_KEYS.forEach((key) => {
        KeyboardJS.bind(
          key,
          (e) => {
            keyboardData[key] = true;
            e.preventDefault();
          },
          (e) => {
            e.preventDefault();
            keyboardData[key] = false;
          },
        );
      });

      serviceData.clearFunctions.push(
        eventSubscription({
          callbacksBus: [
            {event: START, callback: this.onStart},
            {event: MOVE, callback: this.onMove},
            {event: END, callback: this.onEnd},
          ],
        }),
      );

      frameData.frame = requestAnimationFrame(this.update);
    } else {
      const {frameData, serviceData, cameraData, keyboardData} = this;

      KeyboardJS.reset();

      cancelAnimationFrame(frameData.frame);

      [frameData, keyboardData, cameraData].forEach((object) => {
        for (const key in object) object[key] = false;
      });

      serviceData.clearFunctions.forEach((clearFunction) => clearFunction());
      serviceData.clearFunctions.length = 0;
    }
  }

  onStart(e) {
    if (e.cancelable) e.preventDefault();

    const {cameraData} = this;

    if (cameraData.screenPrev) return;

    const {fromScreenX: x, fromScreenY: y} = getEventPosition(e);

    cameraData.screenPrev = {x, y};
  }

  onMove(e) {
    if (e.cancelable) e.preventDefault();

    const {cameraData} = this;

    if (!cameraData.screenPrev) return;

    const {fromScreenX: xValue, fromScreenY: yValue} = getEventPosition(e);

    const x = xValue - cameraData.screenPrev.x;
    const y = yValue - cameraData.screenPrev.y;

    cameraData.offset = {x, y};

    this.updateSight();

    cameraData.screenPrev = {x: xValue, y: yValue};
  }

  onEnd(e) {
    if (e.cancelable) e.preventDefault();

    const {cameraData} = this;

    if (cameraData.screenPrev || cameraData.offset) {
      cameraData.screenPrev = null;
      cameraData.offset = null;
    }
  }

  updatePosition(_, deltaS) {
    const {
      storage: {camera},
      cameraData,
      keyboardData,
    } = this;

    const {w, s} = keyboardData;

    if (w !== s) {
      const moveDistance = deltaS * CameraFlying.SPEED;
      const forward = (cameraData.direction ??= new THREE.Vector3());
      forward.set(0, 0, w ? -1 : 1);
      forward.applyQuaternion(camera.quaternion);
      const addValue = forward.multiplyScalar(moveDistance);
      camera.position.add(addValue);
    }
  }

  updateSight() {
    const {
      storage: {camera},
      cameraData: {offset},
    } = this;

    const rotateX = -offset.y * CameraFlying.SENS;
    const rotateY = -offset.x * CameraFlying.SENS;

    const {x, y, z} = camera.rotation;

    camera.rotation.set(x + rotateX, y + rotateY, z);
  }

  update(timestamp) {
    const {frameData} = this;

    const deltaMS = timestamp - (frameData.timestamp ?? timestamp);
    const deltaS = deltaMS / 1000;
    frameData.timestamp = timestamp;

    this.updatePosition(deltaMS, deltaS);

    frameData.frame = requestAnimationFrame(this.update);
  }
}
