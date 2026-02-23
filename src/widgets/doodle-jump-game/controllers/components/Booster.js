import {Component} from "@shared";

export class Booster extends Component {
  type = "booster";

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
