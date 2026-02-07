import {Component} from "@shared";
import {v4 as uuidv4} from "uuid";

export class Promise extends Component {
  promises = new Map();

  _isActive = true;

  get isActive() {
    return this._isActive;
  }

  has(id) {
    const {promises} = this;
    return promises.has(id);
  }

  hasSome() {
    const {promises} = this;
    return !!promises.size;
  }

  get(id) {
    const {promises} = this;
    return promises.get(id);
  }

  getAll() {
    return Array.from(this.promises.values());
  }

  add(promise, id) {
    const {promises} = this;
    const totalId = id ?? uuidv4();
    promises.set(totalId, promise);
    promise.finally(() => this.isActive && this.remove(totalId));
  }

  remove(idOrPromise) {
    const {promises} = this;
    const promise = this.get(idOrPromise);

    if (promise) {
      promises.delete(idOrPromise);
      return;
    }

    const allPromises = Array.from(this.promises.values());
    const [id] = allPromises.find(promise => promise === idOrPromise) ?? [];
    id && promises.delete(id);
  }

  removeAll() {
    const {promises} = this;
    promises.clear();
  }

  destroy() {
    super.destroy();
    this._isActive = false;
    this.promises.clear();
    this.promises = null;
  }
}
