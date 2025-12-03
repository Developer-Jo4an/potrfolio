import EventDispatcher from "../../lib/event-dispatcher/EventDispatcher";
import BaseController from "../../controllers/base/BaseController";

export default class BaseWrapper {

  static get instance() {
    return this._instance ??= new BaseWrapper();
  }

  eventBus = new EventDispatcher();

  constructor(data) {
    for (const key in data)
      this[key] = data[key];
  }

  registerController(data) {
    const {eventBus} = this;

    this.controller ??= new BaseController({...data, eventBus});
  }

  async initController() {
    const {controller, isInitialized} = this;

    if (!isInitialized) {
      this.isInitialized = true;
      await controller.init();
      return controller;
    } else
      return controller;
  }
}