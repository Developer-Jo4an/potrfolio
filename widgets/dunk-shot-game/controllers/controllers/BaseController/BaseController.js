import {defaultBehaviour} from "../../../lib/behaviour/defaultBehaviour";

export default class BaseController {
  constructor(data) {
    for (const key in data)
      this[key] = data[key];

    this.baseInit();
  }

  init() {

  }

  baseInit() {
    defaultBehaviour(this);
  }

  onStateChanged(state) {

  }
}
