import {upperFirst} from "lodash";
import {Factory} from "@shared";

const METHODS = {create: "create", prepare: "prepare", reset: "reset"};

export class TileExplorerFactory extends Factory {
  constructor(data) {
    super(...arguments);
    this.defaultProperties = data;
  }

  getItemByType(type, data) {
    return this[createMethod(METHODS.create, type)]?.(data);
  }

  getItem(type, data) {
    const storage = this.getStorage(type);
    let item = storage.pop();
    if (item) this[createMethod(METHODS.prepare, type)]?.(item, data);
    else item = this.createItem(type, data);
    return item;
  }

  pushItem(item) {
    const type = item._storageType ?? "unknown";
    const storage = this.getStorage(type);
    this[createMethod(METHODS.reset, type)]?.(item);
    storage.push(item);
  }
}

function createMethod(key, type) {
  return `${key}${upperFirst(type)}`;
}
