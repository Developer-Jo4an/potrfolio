import {PixiWrapper, STATE_DECORATOR_FIELD} from "@shared";
import {Controller} from "./Controller";

export class Wrapper extends PixiWrapper {
  static get instance() {
    return (this._instance ??= new Wrapper());
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

  applyBooster(type) {
    const {
      controller: {
        engine: {
          systems
        }
      }
    } = this;

    const boostersSystem = systems.get("boosters");
    boostersSystem.applyBooster(type);
  }

  reset() {
    return this.controller?.reset();
  }
}
