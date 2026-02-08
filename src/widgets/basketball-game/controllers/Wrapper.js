import {Controller} from "./Controller";
import {STATE_DECORATOR_FIELD, ThreeWrapper} from "@shared";

export class Wrapper extends ThreeWrapper {
  static get instance() {
    return (this._instance ??= new Wrapper());
  }

  registerController(data) {
    const {eventBus} = this;
    this.controller ??= new Controller({
      eventBus,
      rendererSettings: {background: {transparent: true, opacity: 0}, shadow: true},
      ...data,
    });
  }

  get state() {
    return this.controller.decorators[STATE_DECORATOR_FIELD].state;
  }

  set state(state) {
    this.controller.decorators[STATE_DECORATOR_FIELD].state = state;
  }

  activateBooster(type) {
    const {
      controller: {
        storage: {
          engine: {systems},
        },
      },
    } = this;
    const characterSystem = systems.get("character");
    characterSystem.activateBooster(type);
  }

  reset() {
    return this.controller?.reset();
  }
}
