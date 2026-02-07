import {cloneDeep} from "lodash";

export class ProxyGameSpaceStore {
  static _spaces = {};

  static get spaces() {
    return this._spaces;
  }

  static _isInitialized = false;

  static get isInitialized() {
    return this._isInitialized;
  }

  static _initPromise;

  static get initPromise() {
    return this._initPromise;
  }

  static get(name) {
    return (this.spaces[name] ??= new ProxyGameSpaceStore({name}));
  }

  static init() {
    if (!this.initPromise)
      return this._initPromise = new Promise(async res => {
        const {default: onChange} = await import("on-change");
        global.onChange = onChange;
        this._isInitialized = true;
        res();
      });

    return this.initPromise;
  }

  _listeners = new Set();

  constructor({name}) {
    this.name = name;

    this.getSnapshot = this.getSnapshot.bind(this);
    this.getServerSnapshot = this.getServerSnapshot.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.reset = this.reset.bind(this);
  }

  initGameSpaceProxy(gameSpaceData) {
    this._gameSpace = onChange(gameSpaceData, () => {
      this._emit(cloneDeep(this._gameSpace));
    });
  }

  init(gameSpaceData) {
    if (!ProxyGameSpaceStore.isInitialized) return;

    this._savedGameSpace = gameSpaceData;
    this._trackedSpace = gameSpaceData;

    this.initGameSpaceProxy(cloneDeep(gameSpaceData));
  }

  get gameSpace() {
    return this._gameSpace;
  }

  getSnapshot() {
    return this._trackedSpace;
  }

  getServerSnapshot() {
    return this._trackedSpace;
  }

  subscribe(listener) {
    const {_listeners} = this;
    _listeners.add(listener);
    return () => _listeners.delete(listener);
  }

  reset() {
    const {_savedGameSpace} = this;
    this.initGameSpaceProxy(cloneDeep(_savedGameSpace));
    this._trackedSpace = cloneDeep(_savedGameSpace);
  }

  _emit(gameData) {
    this._trackedSpace = gameData;
    this._listeners.forEach(listener => listener());
  }
}
