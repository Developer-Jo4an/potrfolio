import {Component} from "@shared";

export class Queue extends Component {
  _queue;

  _prevQueues;

  max;

  constructor({queue = [], prevQueues = [], max = 7}) {
    super(...arguments);

    this._queue = queue;
    this._prevQueues = prevQueues;
    this.max = max;
  }

  get queue() {
    return this._queue;
  }

  set queue(newQueue) {
    this._prevQueues.push([...this.queue]);
    this._queue = newQueue;
  }

  get prevQueues() {
    return this._prevQueues;
  }

  destroy() {
    super.destroy();
    this._queue = null;
    this._prevQueues = null;
    this.max = null;
  }
}
