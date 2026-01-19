import {createId} from "../../../lib";
import {isFunction} from "lodash";

const getId = createId();

export class FactoryStorage {

  items = [];

  createdItems = [];

  constructor({type = "unknown"} = {}) {
    this.type = type;
  }

  get activeItems() {
    return this.createdItems.filter(item => !this.items.includes(item));
  }

  getItemByIdFromActive(id) {
    return this.activeItems.find(item => item.id === id);
  }

  getItemByFactoryUidFromActive(uid) {
    return this.activeItems.find(item => item._factoryUUID === uid);
  }

  getItemById(id) {
    return this.items.find(item => item.id === id);
  }

  getItemByFactoryUid(id) {
    return this.items.find(item => item._factoryUUID === id);
  }

  pop() {
    if (!this.items.length) return;
    const item = this.items.splice(this.items.length - 1, 1)[0];
    item._isFactoryActiveItem = true;
    return item;
  }

  resetItems() {
    const {items, createdItems} = this;
    createdItems.forEach(item => {
      if (items.indexOf(item) !== -1) return;
      this.push(item);
    });
  }

  onCreateItem(type, item) {
    if (!item) {
      console.error(`No item with type ${type}`);
      return;
    }
    item._storageType = type;
    item._factoryUUID = getId();
    item._isFactoryActiveItem = true;

    if (this.createdItems.indexOf(item) === -1)
      this.createdItems.push(item);
  }

  push(item = {}) {
    const {items} = this;

    if (items.indexOf(item) !== -1) {
      console.error(`Duplicate item in ${this.type}`);
      return;
    }

    if (isFunction(item.reset))
      item.reset();
    items.push(item);
    item._isFactoryActiveItem = false;
  }

  clear() {
    this.items.length = 0;
    this.createdItems.length = 0;
  }
}
