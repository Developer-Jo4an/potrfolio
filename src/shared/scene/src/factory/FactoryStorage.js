export class FactoryStorage {
  items = [];

  createdItems = [];

  constructor({type = "unknown"} = {}) {
    this.type = type;
  }

  get activeItems() {
    return this.createdItems.filter((item) => !this.items.includes(item));
  }

  pop() {
    if (!this.items.length) return;
    const item = this.items.splice(this.items.length - 1, 1)[0];
    item._isFactoryActiveItem = true;
    return item;
  }

  onCreateItem(type, item) {
    if (!item) {
      console.error(`No item with type ${type}`);
      return;
    }
    item._storageType = type;
    item._factoryUUID = crypto.randomUUID();
    item._isFactoryActiveItem = true;

    if (this.createdItems.indexOf(item) === -1) this.createdItems.push(item);
  }

  push(item = {}) {
    const {items} = this;

    if (items.indexOf(item) !== -1) {
      console.error(`Duplicate item in ${this.type}`);
      return;
    }

    items.push(item);
    item._isFactoryActiveItem = false;
  }

  clear() {
    this.items.length = 0;
    this.createdItems.length = 0;
  }
}
