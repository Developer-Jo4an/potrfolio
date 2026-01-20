import {ECSPlugin} from "../performance/ecs/ECSPlugin";
import {FactoryPlugin} from "../performance/scene/FactoryPlugin";
import {EventDispatcher} from "../lib/event-dispatcher/EventDispatcher";

export class Analytics {
  static plugins = [ECSPlugin, FactoryPlugin];

  eventBus = new EventDispatcher();

  plugins = [];

  constructor() {
    this.init();
  }

  logStatistics() {
    console.log("%c______", "color: #ff0000; font-size: 40px");
    console.log("%cPerformance statistics", "color: #ff0000; font-size: 40px");
    Object.entries(this.statistics).forEach(([pluginName, contexts]) => {
      console.log(`%c${pluginName}`, "font-size: 30px;");
      contexts.forEach(({table, context}) => {
        console.log("%c_________", "color: #0000ff; font-size: 30px;");
        console.log("Context", context);
        console.table(table);
        console.log("%c_________", "color: #0000ff; font-size: 30px;");
      });
    });
    console.log("%c______", "color: #ff0000; font-size: 40px;");
  }

  get statistics() {
    const {plugins} = this;
    const statistics = {};
    plugins.forEach((plugin) => (statistics[plugin.type] = plugin.stats));
    return statistics;
  }

  connect(type, context) {
    const plugin = this.getPlugin(type);
    if (plugin) plugin.connect(context);
  }

  getPlugin(type) {
    const {plugins} = this;
    return plugins.find((plugin) => plugin.type === type);
  }

  init() {
    const {eventBus} = this;
    this.plugins = Analytics.plugins.map((Plugin) => new Plugin({eventBus}));
  }
}

export const analysis = new Analytics();
