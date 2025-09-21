import {defaultBehaviour} from "../../../lib/behaviour/defaultBehaviour";
import {dunkShotFactory} from "../../factory/DunkShotFactory";

export default class BaseEntity {

  constructor(data) {
    for (const key in data)
      this[key] = data[key];

    this.baseInit();
  }

  get view() {
    return this._view;
  }

  set view(view) {
    this._view = view;
    view.classWrapper = this;
  }

  baseInit() {
    defaultBehaviour(this);
  }

  addToStage() {
    const {view} = this;
    const {mainContainer} = dunkShotFactory;
    mainContainer.view.addChild(view);
  }

  onStateChanged(state) {

  }

  update() {

  }

  reset() {

  }

  destroy() {

  }
}
