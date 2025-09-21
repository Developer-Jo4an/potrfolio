import BaseController from "../BaseController/BaseController";
import {DUNK_SHOT_STATE_MACHINE} from "../../../constants/stateMachine";
import global from "../../../../../shared/constants/global/global";

export default class UpdateController extends BaseController {

  static maxDelta15FPS = 3;

  static MaxFPSForPhysics = 60;

  static PixiDelta60FPS = 1;

  acc = 0;

  updateType = "saved"; // saved | standard

  constructor(data) {
    super(data);
  }

  get isStarted() {
    return this.app.ticker.started;
  }

  stopUpdate() {
    const {app} = this;
    app.ticker.stop();
  }

  startUpdate() {
    const {app} = this;
    app.ticker.start();
  }

  setUpdateCallback(callback) {
    const {app} = this;
    app.ticker.add(callback);
  }

  update(deltaTime = 0) {
    const {updateType, state} = this;

    if (deltaTime > UpdateController.maxDelta15FPS || !DUNK_SHOT_STATE_MACHINE[state]?.isAvailableUpdate) return;

    const milliseconds = deltaTime * (1000 / 60);

    this[`${updateType}Update`]?.(milliseconds, deltaTime);
  }

  standardUpdate(milliseconds, deltaTime) {
    const {controllers, engine} = this;

    controllers.forEach(controller => controller?.update?.(milliseconds, deltaTime));
    global.Matter.Engine.update(engine, milliseconds);
  }

  savedUpdate(milliseconds) {
    const {controllers, engine, storage: {mainSceneSettings: {update: {threshold}}}} = this;

    const fixedDeltaTime = 1 / UpdateController.MaxFPSForPhysics;

    const addedValue = milliseconds / 1000;

    this.acc += Math.abs(addedValue - fixedDeltaTime) <= threshold ? fixedDeltaTime : addedValue;

    while (this.acc >= fixedDeltaTime) {
      const totalUpdateMilliseconds = fixedDeltaTime * 1000;
      controllers.forEach(controller => controller?.update?.(totalUpdateMilliseconds, UpdateController.PixiDelta60FPS));
      global.Matter.Engine.update(engine, totalUpdateMilliseconds);
      this.acc -= fixedDeltaTime;
    }
  }

  reset() {
    this.acc = 0;
    this.stopUpdate();
  }
}