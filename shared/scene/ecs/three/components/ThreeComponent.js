import Component from "../../core/Component";

export default class ThreeComponent extends Component {
  type = "threeComponent";

  constructor({eventBus, threeObject}) {
    super({eventBus});

    this.threeObject = threeObject;
  }
}
