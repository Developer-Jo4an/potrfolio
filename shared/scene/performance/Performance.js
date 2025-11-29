import Stats from "stats.js";
import FPSMeter, {fpsMeter} from "./fps-meter";
import ECSPlugin from "./ecs/ECSPlugin";
import FactoryPlugin from "./scene/FactoryPlugin";
import EventDispatcher from "../lib/event-dispatcher/EventDispatcher";
import {getIsDebug} from "../../lib/debug/debug";

export default class Performance {

  static plugins = [
    ECSPlugin,
    FactoryPlugin
  ];

  debug = getIsDebug();

  stats;

  eventBus = new EventDispatcher();

  plugins = []

  constructor() {

    if (!global.window) return;

    this.update = this.update.bind(this);
    this.onDecreaseStepChange = this.onDecreaseStepChange.bind(this);


    this.init();
    this.update();

    global.window.__performanceAnalysis = this;
  }

  logStatistics() {
    console.log("%c______", 'color: #ff0000; font-size: 40px');
    console.log("%cPerformance statistics", 'color: #ff0000; font-size: 40px');
    Object.entries(this.statistics).forEach(([pluginName, contexts]) => {
      console.log(`%c${pluginName}`, "font-size: 30px;");
      contexts.forEach(({table, context}) => {
        console.log("%c_________", 'color: #0000ff; font-size: 30px;');
        console.log("Context", context);
        console.table(table);
        console.log("%c_________", 'color: #0000ff; font-size: 30px;');
      })
    })
    console.log("%c______", 'color: #ff0000; font-size: 40px;');
  }

  get statistics() {
    const statistics = {};
    this.plugins.forEach(plugin => statistics[plugin.type] = plugin.stats);
    return statistics;
  }

  connect(type, context) {
    const plugin = this.getPlugin(type);
    if (!plugin) return;
    plugin.connect(context);
  }

  getPlugin(type) {
    return this.plugins.find(p => p.type === type);
  }

  init() {
    const {eventBus} = this;
    this.plugins = Performance.plugins.map((Plugin) => new Plugin({eventBus}));

    this.initStats();
    this.initFPSMeter();
  }

  initFPSMeter() {
    FPSMeter.listen(this.onDecreaseStepChange);
    fpsMeter.start();
  }

  onDecreaseStepChange(step) {
    this.eventBus.dispatchEvent({type: "performance:decreaseStep", data: {step}});
  }

  initStats() {
    const stats = this.stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);
  }

  update() {
    this.stats?.end?.();
    this.stats?.begin?.();

    requestAnimationFrame(this.update);
  }

}

export const performanceAnalysis = new Performance();
