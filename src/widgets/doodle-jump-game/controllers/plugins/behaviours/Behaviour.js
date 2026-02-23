import {Plugin} from "../Plugin";

export class Behaviour extends Plugin {
  apply() {
    return this.clear.bind(this);
  }

  clear() {}
}
