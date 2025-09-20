import PixiWrapper from "../../../shared/scene/wrappers/pixi/PixiWrapper";
import Controller from "./Controller";

export default class Wrapper extends PixiWrapper {

  static get instance() {
    return this._instance ??= new Wrapper();
  }

  constructor(data) {
    super(data);
  }

  async initController(data) {
    const {controller} = this;

    if (!controller) {
      const controller = this.controller = new Controller(data);
      await controller.init();
      return controller;
    } else
      return controller;
  }
}