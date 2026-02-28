import {eventSubscription, System} from "@shared";
import {Events} from "../constants/events";

export class Interactive extends System {
  constructor() {
    super(...arguments);

    this.onClick = this.onClick.bind(this);
  }

  initializationLevelSelect() {
    this.initEvents();
  }

  initEvents() {
    const {
      storage: {
        stage,
        renderer,
        serviceData: {clearFunctions},
      },
    } = this;

    stage.eventMode = "static";
    stage.hitArea = renderer.screen;

    const clear = eventSubscription({
      target: stage,
      callbacksBus: [{event: "pointertap", callback: this.onClick}],
    });

    clearFunctions.push(() => {
      stage.eventMode = "passive";
      stage.hitArea = null;
      clear();
    });
  }

  onClick(e) {
    const {eventBus} = this;
    eventBus.dispatchEvent({type: Events.CLICK, event: e});
  }
}
