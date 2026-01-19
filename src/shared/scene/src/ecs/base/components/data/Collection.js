import {Component} from "../../../core/Component";

export class Collection extends Component {
  list = [];

  type = "collection";

  group = "side-effects";

  destroy() {
    super.destroy();
    this.list = null;
  }
}
