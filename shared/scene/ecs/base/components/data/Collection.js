import Component from "../../../core/Component";

export default class Collection extends Component {
  list = [];

  type = "collection";

  group = "side-effects";

  destroy() {
    super.destroy();
    this.list = null;
  }
}
