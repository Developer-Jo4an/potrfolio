export class Collection {
  name;

  list = [];

  map = {};

  constructor({name}) {
    this.name = name;
  }

  sort(fnc) {
    return this.list.sort(fnc);
  }

  add(item) {
    const {list, map} = this;
    if (list.includes(item)) return;
    list.push(item);
    if (item.uuid) map[item.uuid] = item;
  }

  get(uuid) {
    return this.map[uuid];
  }

  remove(item) {
    const {list} = this;
    if (!list.includes(item)) return;
    list.splice(list.indexOf(item), 1);
    if (item.uuid) delete this.map[item.uuid];
  }
}
