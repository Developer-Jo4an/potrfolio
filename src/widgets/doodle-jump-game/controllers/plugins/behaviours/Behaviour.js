import {Plugin} from "@shared";

export class Behaviour extends Plugin {
  apply() {
    return this.clear.bind(this);
  }

  clear() {}
}
