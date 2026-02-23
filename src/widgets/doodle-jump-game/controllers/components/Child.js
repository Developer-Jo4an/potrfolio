import {Component} from "@shared";

export class Child extends Component {
  type = "child";

  childUUIDS = [];

  constructor({childUUIDS}) {
    super(...arguments);

    this.childUUIDS = childUUIDS ?? this.childUUIDS;
  }

  add(childUUID) {
    const {childUUIDS} = this;
    childUUIDS.push(childUUID);
  }

  destroy() {
    super.destroy();
    this.childUUIDS = null;
  }
}
