import BaseWrapper from "../base/BaseWrapper";
import PIXIController from "../../controllers/pixi/PIXIController";

export default class PixiWrapper extends BaseWrapper {

  static get instance() {
    return this._instance ??= new PixiWrapper();
  }

  appendContainer($container) {
    this.controller.appendContainer($container);
  }

  registerController(data) {
    const {eventBus} = this;

    this.controller ??= new PIXIController({...data, eventBus});
  }
}