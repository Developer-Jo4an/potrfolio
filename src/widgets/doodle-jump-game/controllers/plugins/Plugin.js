export class Plugin {
  constructor({eventBus, storage, system, engine}) {
    this.eventBus = eventBus;
    this.storage = storage;
    this.system = system;
    this.engine = engine;
  }
}
