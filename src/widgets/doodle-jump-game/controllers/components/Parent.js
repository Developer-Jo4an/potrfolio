import {Component} from "@shared";

export class Parent extends Component {
  type = "parent";

  parentUUID;

  constructor({parentUUID}) {
    super(...arguments);

    this.parentUUID = parentUUID;
  }

  destroy() {
    super.destroy();
    this.parentUUID = null;
  }
}
