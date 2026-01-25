import {Component} from "@shared";

export class AbstractTree extends Component {
  tree;

  constructor({tree}) {
    super(...arguments);

    this.tree = tree;
  }

  destroy() {
    super.destroy();
    this.tree = null;
  }
}
