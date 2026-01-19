import {FactoryStorage} from "./FactoryStorage";
import {analysis} from "../analytics/Analytics";

export class Factory {

  storage = {};

  defaultProperties = {};

  constructor() {
    analysis.connect("factory", this);
  }

  setDefaultProperties(properties) {
    this.defaultProperties = properties;
  }

  getItemByType(type, data) {

  }

  createItem(type, data = {}) {
    const {defaultProperties: {args = []}} = this;
    let item;

    if (data.Cls) item = new data.Cls(...[...args, ...data.args]);
    else item = this.getItemByType(type, data);

    if (!item) throw new Error(`No item created`);

    this.onCreateItem(type, item, data);
    return item;
  }

  onCreateItem(type, item, data) {
    const storage = this.getStorage(type);
    storage.onCreateItem(type, item, data);
  }

  getItem(type, data) {
    const storage = this.getStorage(type);
    let item = storage.pop();

    if (!item) item = this.createItem(type, data);

    return item;
  }

  resetStorageItems(type) {
    return this.getStorage(type).resetItems();
  }

  pushItem(item, type) {
    type = type || item._storageType || "unknown";
    const storage = this.getStorage(type);
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

  prepareItems(data) {
    data.forEach(({type, data}) => {
      const item = this.createItem(type, data);
      this.pushItem(item);
    });
  }

  clear() {
    Object.entries(this.storage)
    .forEach(([, storage]) => {
      storage.clear();
      delete this.storage;
    });
  }
}
