import {MouseTrailController} from "./MouseTrailController";

export class MouseTrailWrapper {

  static get instance() {
    return this._instance ??= new MouseTrailWrapper();
  }

  async initController() {
    const controller = this.controller ??= new MouseTrailController();
    await controller.init();
  }

  set container(container) {
    const {controller} = this;
    controller.container = container;
  }

  get isActive() {
    const {controller} = this;
    return controller.isActive;
  }

  set isActive(isActive) {
    const {controller} = this;
    controller.isActive = isActive;
  }
}