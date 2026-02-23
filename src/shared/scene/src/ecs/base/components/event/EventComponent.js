import {Component} from "../../../core/Component";

export class EventComponent extends Component {
  type;

  data;

  constructor({type, data}) {
    super(...arguments);
    this.type = type;
    this.data = data;
  }

  destroy() {
    super.destroy();
    this.type = null;
    this.data = null;
  }
}
