import {factory} from "../../factory/Factory";
import {setNecessaryListeners} from "../../utils/setNecessaryListeners";

export class BaseEntity {
  constructor(data) {
    for (const key in data) this[key] = data[key];

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
    setNecessaryListeners(this);
  }

  addToStage() {
    const {view} = this;
    const {mainContainer} = factory;
    mainContainer.view.addChild(view);
  }

  onStateChanged(state) {}

  update() {}

  reset() {}

  destroy() {}
}
