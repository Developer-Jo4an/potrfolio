import {FactoryStorage} from "./FactoryStorage";
import {analytics} from "../analytics/Analytics";
import {isFunction} from "lodash";

export class Factory {
  storage = {};

  defaultProperties = {};

  config = {};

  constructor({defaultProperties, config} = {}) {
    this.defaultProperties = defaultProperties ?? {};
    this.config = config ?? {};
    analytics.connect("factory", this);
  }

  setDefaultProperties(properties) {
    this.defaultProperties = properties;
  }

  getItemByType(type, data) {
  }

  createItem(type, data = {}) {
    const {
      defaultProperties,
      defaultProperties: {args = []},
      config
    } = this;

    const fullData = {...defaultProperties, ...data};

    let item;

    if (config[type]) {
      const {Cls, baseSettings = {}} = config[type];

      item = new Cls({baseSettings, defaultProperties, extraSettings: fullData.extraData});
      item.create();
    } else {
      if (fullData.Cls) item = new fullData.Cls(...[...args, ...fullData.args]);
      else item = this.getItemByType(type, fullData);

      if (!item) throw new Error(`No item created`);
    }

    this.onCreateItem(type, item, fullData);
    return item;
  }

  onCreateItem(type, item, data) {
    const storage = this.getStorage(type);
    storage.onCreateItem(type, item, data);
  }

  getItem(type, data = {}) {
    const {config} = this;

    const storage = this.getStorage(type);
    let item = storage.pop();

    if (!item) item = this.createItem(type, data);
    else if (config[type]) {
      item.updateExtraSettings(data.extraData);
      item.prepare();
    }

    return item;
  }

  pushItem(item, type) {
    type = type || item._storageType || "unknown";
    const storage = this.getStorage(type);
    isFunction(item.reset) && item.reset();
    storage.push(item);
  }

  getStorage(type) {
    if (this.storage[type]) return this.storage[type];

    this.storage[type] = new FactoryStorage({type});

    return this.storage[type];
  }

  getItemByIdFromActive(id) {
    for (const storage of Object.values(this.storage)) {
      const item = storage.getItemByIdFromActive(id);
      if (item) return item;
    }
  }

  getItemByFactoryUidFromActive(uid) {
    for (const storage of Object.values(this.storage)) {
      const item = storage.getItemByFactoryUidFromActive(uid);
      if (item) return item;
    }
  }

  getItemById(id) {
    for (const storage of Object.values(this.storage)) {
      const item = storage.getItemById(id);
      if (item) return item;
    }
  }

  getItemByFactoryUid(uid) {
    for (const storage of Object.values(this.storage)) {
      const item = storage.getItemByFactoryUid(uid);
      if (item) return item;
    }
  }

  resetStorageItems(type) {
    return this.getStorage(type).resetItems();
  }

  prepareItems(data) {
    data.forEach(({type, data}) => {
      const item = this.createItem(type, data);
      this.pushItem(item);
    });
  }

  clear() {
    Object.entries(this.storage).forEach(([, storage]) => {
      storage.clear();
      delete this.storage;
    });
  }
}
