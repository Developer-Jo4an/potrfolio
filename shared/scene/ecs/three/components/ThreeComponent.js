import Component from "../../core/Component";

export default class ThreeComponent extends Component {
  threeObject;

  constructor({threeObject}) {
    super(...arguments);

    this.threeObject = threeObject;
  }

  destroy() {
    super.destroy();
    this.threeObject = null;
  }
}
