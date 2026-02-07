import {Component} from "@shared";

export class Booster extends Component {
  type;

  isActive;

  constructor({type, isAvailable}) {
    super(...arguments);

    this.type = type;
    this.isActive = isAvailable;
  }

  destroy() {
    super.destroy();
    this.type = null;
    this.isActive = null;
  }
}
