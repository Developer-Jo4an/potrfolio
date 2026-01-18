import PIXIUpdate from "../pixi-update/PIXIUpdate";

export default class PIXIMatterUpdate extends PIXIUpdate {

  static MAX_DELTA_15_FPS = 3;

  static MAX_FPS_FOR_PHYSICS = 60;

  static PIXI_DELTA_60_FPS = 1;

  static THRESHOLD = 0.001;

  updateType = "saved"; // saved | standard

  acc = 0;

  constructor(data) {
    super(data);
  }

  update({deltaMS, deltaTime = 0}) {
    const {updateType} = this;

    if (deltaTime <= PIXIMatterUpdate.MAX_DELTA_15_FPS)
      this[`${updateType}Update`]?.(deltaMS, deltaTime);
  }

  standardUpdate(deltaMS, deltaTime) {
    this.throwEvent({deltaMS, deltaTime});
  }

  savedUpdate(deltaMS) {
    const fixedDeltaTime = 1 / PIXIMatterUpdate.MAX_FPS_FOR_PHYSICS;
    const addedValue = deltaMS / 1000;
    this.acc += Math.abs(addedValue - fixedDeltaTime) <= PIXIMatterUpdate.THRESHOLD ? fixedDeltaTime : addedValue;

    while (this.acc >= fixedDeltaTime) {
      const totalUpdateMilliseconds = fixedDeltaTime * 1000;
      this.throwEvent({deltaMS: totalUpdateMilliseconds, deltaTime: PIXIMatterUpdate.PIXI_DELTA_60_FPS});
      this.acc -= fixedDeltaTime;
    }
  }

  reset() {
    this.acc = 0;
    this.stopUpdate();
  }
}