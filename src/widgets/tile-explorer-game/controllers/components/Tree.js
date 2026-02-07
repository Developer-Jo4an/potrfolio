import {Component, clone} from "@shared";

export class Tree extends Component {
  _tree;

  _prevTrees = [];

  constructor({tree, prevTrees = []}) {
    super(...arguments);

    this._tree = tree;
    this._prevTrees = prevTrees;
  }

  get tree() {
    return this._tree;
  }

  get prevTrees() {
    return this._prevTrees;
  }

  set tree(newTree) {
    this.tree && this._prevTrees.push(clone(this.tree));
    this._tree = clone(newTree);
  }

  destroy() {
    super.destroy();
    this._tree = null;
    this._prevTrees = null;
  }
}
