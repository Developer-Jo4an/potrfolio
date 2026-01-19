import {setNecessaryListeners} from "../../utils/setNecessaryListeners";

export class BaseController {
  constructor(data) {
    for (const key in data)
      this[key] = data[key];

    this.baseInit();
  }

  init() {

  }

  baseInit() {
    setNecessaryListeners(this)
  }

  onStateChanged(state) {

  }
}
