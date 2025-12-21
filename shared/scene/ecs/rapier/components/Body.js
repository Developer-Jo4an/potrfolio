import Component from "../../core/Component";

export default class Body extends Component {
  object;

  constructor({object}) {
    super(...arguments);
    this.object = object;
  }

  destroy() {
    super.destroy();
    this.object = null;
  }
}
