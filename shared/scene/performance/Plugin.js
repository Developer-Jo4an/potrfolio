export default class Plugin {

  contexts = [];

  type = "unknown";

  constructor({eventBus}) {
    this.eventBus = eventBus;
  }

  connect(context) {
    this.contexts.push(context);
  }

  getContextStats(context) {
    return {};
  }

  get stats() {
    return this.contexts.map((context) => this.getContextStats(context));
  }
}
