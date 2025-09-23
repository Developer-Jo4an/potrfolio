import {dunkShotFactory} from "../../factory/DunkShotFactory";
import setNecessaryListeners from "../../utils/setNecessaryListeners";

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
    setNecessaryListeners(this)
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
