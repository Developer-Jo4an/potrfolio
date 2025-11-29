import Component from "../../core/Component";

export default class EventComponent extends Component {
  type;

  data;

  constructor(data) {
    super(data);
    this.type = data.type;
    this.data = data.data;
  }

  destroy() {
    this.type = null;
    this.data = null;
    super.destroy();
  }
}
