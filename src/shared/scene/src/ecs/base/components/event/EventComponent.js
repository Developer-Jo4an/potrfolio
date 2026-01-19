import {Component} from "../../../core/Component";

export class EventComponent extends Component {
  type;

  data;

  constructor(data) {
    super(...arguments);
    this.type = data.type;
    this.data = data.data;
  }

  destroy() {
    super.destroy();
    this.type = null;
    this.data = null;
  }
}
