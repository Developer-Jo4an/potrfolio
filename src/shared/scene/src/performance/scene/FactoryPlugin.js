import {Plugin} from "../../analytics/Plugin";

export class FactoryPlugin extends Plugin {

  type = "factory";

  getContextStats(context) {
    const table = {};

    Object.entries(context.storage).forEach(([name, storage]) => {
      table[`s_${name}`] = {items: storage.items.length, createdItems: storage.createdItems.length};
    });
    return {
      context,
      table
    }
  }
}
