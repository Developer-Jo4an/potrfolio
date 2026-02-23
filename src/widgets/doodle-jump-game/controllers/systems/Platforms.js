import {Events} from "../constants/events";
import {System, eventSubscription} from "@shared";

export class Platforms extends System {
  constructor() {
    super(...arguments);

    this.onCollide = this.onCollide.bind(this);
  }

  initializationLevelSelect() {
    this.initEvents();
  }

  initEvents() {
    const {
      storage: {
        serviceData: {clearFunctions},
      },
      eventBus,
    } = this;

    const clear = eventSubscription({
      target: eventBus,
      callbacksBus: [{event: Events.CHARACTER_COLLIDE_WITH_PLATFORM, callback: this.onCollide}],
    });

    clearFunctions.push(clear);
  }

  onCollide({platform}) {
    const {cCounter} = this.getPlatformInfo(platform);
    cCounter.current++;
  }
}
