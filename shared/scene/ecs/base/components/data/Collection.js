import Component from "../../../core/Component";

export default class Collection extends Component {
  list = [];

  type = "collection";

  group = "side-effects";

  constructor({eventBus, group}) {
    super({eventBus});

    group && (this.group = group);
  }
}
