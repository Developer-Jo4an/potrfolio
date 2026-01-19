import {Plugin} from "../../analytics/Plugin";

export class ECSPlugin extends Plugin {

  type = "ecs";

  getContextStats(context) {

    const table = {
      systemsCount: context.systems.list.length,
    };
    Object.entries(context.components).forEach(([name, collection]) => table[`c_${name}`] = collection.list.length);
    Object.entries(context.entities).forEach(([name, collection]) => table[`e_${name}`] = collection.list.length);

    return {
      context,
      table
    }
  }
}
