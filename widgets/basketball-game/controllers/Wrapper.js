import ThreeWrapper from "../../../shared/scene/wrappers/three/ThreeWrapper";
import Controller from "./Controller";
import {STATE_DECORATOR_FIELD} from "../../../shared/scene/constants/decorators/names";

export default class Wrapper extends ThreeWrapper {
  static get instance() {
    return this._instance ??= new Wrapper();
  }

  registerController(data) {
    const {eventBus} = this;
    this.controller ??= new Controller({eventBus, ...data});
  }

  get state() {
    return this.controller.decorators[STATE_DECORATOR_FIELD].state;
  }

  set state(state) {
    this.controller.decorators[STATE_DECORATOR_FIELD].state = state;
  }

  reset() {
    return this.controller?.reset();
  }
}