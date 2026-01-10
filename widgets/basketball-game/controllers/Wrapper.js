import ThreeWrapper from "../../../shared/scene/wrappers/three/ThreeWrapper";
import Controller from "./Controller";
import {STATE_DECORATOR_FIELD} from "../../../shared/scene/constants/decorators/names";
import {UUIDS} from "../constants/systems";

export default class Wrapper extends ThreeWrapper {
  static get instance() {
    return this._instance ??= new Wrapper();
  }

  registerController(data) {
    const {eventBus} = this;
    this.controller ??= new Controller({
      eventBus,
      rendererSettings: {background: {transparent: true, opacity: 0}, shadow: true},
      ...data
    });
  }

  get state() {
    return this.controller.decorators[STATE_DECORATOR_FIELD].state;
  }

  set state(state) {
    this.controller.decorators[STATE_DECORATOR_FIELD].state = state;
  }

  activateBooster(type) {
    const {controller: {storage: {engine: {systems}}}} = this;
    const boostersSystem = systems.get(UUIDS.character);
    boostersSystem.activateBooster(type);
  }

  reset() {
    return this.controller?.reset();
  }
}