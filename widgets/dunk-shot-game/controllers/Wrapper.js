import PixiWrapper from "../../../shared/scene/wrappers/pixi/PixiWrapper";
import Controller from "./Controller";

export default class Wrapper extends PixiWrapper {

  static get instance() {
    return this._instance ??= new Wrapper();
  }

  constructor(data) {
    super(data);
  }

  registerController(data) {
    const {eventBus} = this;

    this.controller ??= new Controller({...data, eventBus});
  }
}