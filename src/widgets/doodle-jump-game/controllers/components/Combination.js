import {Component} from "@shared";

export class Combination extends Component {
  type = "combination";

  combinationId;

  constructor({combinationId}) {
    super(...arguments);

    this.combinationId = combinationId;
  }

  destroy() {
    super.destroy();
    this.combinationId = null;
  }
}
