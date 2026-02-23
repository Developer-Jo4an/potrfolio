import {Component} from "@shared";

export class Immunity extends Component {
  type = "immunity";

  isActive = false;

  constructor({isActive}) {
    super(...arguments);

    this.isActive = isActive ?? this.isActive;
  }

  destroy() {
    super.destroy();
    this.isActive = null;
  }
}
