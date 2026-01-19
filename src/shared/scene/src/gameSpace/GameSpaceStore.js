import {cloneDeep} from "lodash";

export class GameSpaceStore {
  listeners = new Set();

  constructor(gameSpaceData) {
    this.savedGameSpace = cloneDeep(gameSpaceData);
    this.gameSpace = cloneDeep(gameSpaceData);

    this.set = this.set.bind(this);
    this.get = this.get.bind(this);

    this.reset = this.reset.bind(this);

    this.getSnapshot = this.getSnapshot.bind(this);
    this.getServerSnapshot = this.getServerSnapshot.bind(this);

    this.subscribe = this.subscribe.bind(this);
  }

  get() {
    return this.gameSpace;
  }

  set(func) {
    const {gameSpace, listeners} = this;

    func(gameSpace);

    this.gameSpace = cloneDeep(gameSpace);

    listeners.forEach(listener => listener());
  }


  reset() {
    this.gameSpace = cloneDeep(this.savedGameSpace);
  }


  getSnapshot() {
    return this.get();
  }

  getServerSnapshot() {
    return this.get();
  }


  subscribe(listener) {
    const {listeners} = this;
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
}