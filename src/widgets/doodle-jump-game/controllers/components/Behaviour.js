import {Component} from "@shared";

export class Behaviour extends Component {
  type = "behaviour";

  group;

  data;

  constructor({group, data}) {
    super(...arguments);

    this.group = group;
    this.data = data;
  }

  destroy() {
    super.destroy();
    this.group = null;
    this.data = null;
  }
}
