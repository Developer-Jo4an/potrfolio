import Component from "../../../core/Component";

export default class Collection extends Component {
  list = [];

  type = "collection";

  constructor(data) {
    super(data);

    this.group = data.group;
  }
}
