import {Component} from "@shared";

export class Counter extends Component {
  type = "counter";

  _current = 0;

  max = Number.MAX_VALUE;

  constructor({current, max}) {
    super(...arguments);

    this._current = current ?? this._current;
    this.max = max ?? this.max;
  }

  get current() {
    return this._current;
  }

  set current(newCurrent) {
    const {max} = this;
    this._current = Math.min(max, newCurrent);
  }

  destroy() {
    super.destroy();
    this._current = null;
    this.max = null;
  }
}
