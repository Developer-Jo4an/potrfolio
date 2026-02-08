export class Booster {
  static boosterName = "base";

  constructor({storage, eventBus, system}) {
    this.storage = storage;
    this.eventBus = eventBus;
    this.system = system;
  }

  get isAvailable() {
    return true;
  }

  apply() {
    this.enable();
  }

  enable() {
    const {
      storage: {gameSpace},
      system
    } = this;

    const {cBooster} = system.getBoosterInfo();

    const {boosterName: name} = this.constructor;

    cBooster.isActive = true;
    cBooster.type = gameSpace.booster.active = name;
    gameSpace.booster[name]--;
  }

  disable() {
    const {
      storage: {gameSpace},
      system
    } = this;

    const {cBooster} = system.getBoosterInfo();

    cBooster.isActive = false;
    cBooster.type = gameSpace.booster.active = null;
  }

  reset() {
    this.disable();
  }
}
