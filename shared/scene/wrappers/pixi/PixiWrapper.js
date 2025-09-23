import BaseWrapper from "../base/BaseWrapper";
import PIXIController from "../../controllers/pixi/PIXIController";

export default class PixiWrapper extends BaseWrapper {

  static get instance() {
    return this._instance ??= new PixiWrapper();
  }

  constructor(data) {
    super(data);
  }

  registerController(data) {
    const {eventBus} = this;

    this.controller ??= new PIXIController({...data, eventBus});
  }
}