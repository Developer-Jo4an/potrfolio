import {BaseWrapper} from "../base/BaseWrapper";
import {ThreeController} from "../../controllers/three/ThreeController";

export class ThreeWrapper extends BaseWrapper {
  static get instance() {
    return this._instance ??= new ThreeWrapper();
  }

  appendContainer($container) {
    this.controller.appendContainer($container);
  }

  registerController(data) {
    const {eventBus} = this;
    this.controller ??= new ThreeController({...data, eventBus});
  }
}