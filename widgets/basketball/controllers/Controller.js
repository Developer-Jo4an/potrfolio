import PIXIController from "../../../shared/scene/controllers/pixi/PIXIController";
import {eventSubscription} from "../../../shared/lib/events/eventListener";
import {RESIZE} from "../../../shared/constants/events/eventsNames";
import {UPDATED} from "../../../shared/scene/constants/events/names";
import global from "../../../shared/constants/global/global";

export default class Controller extends PIXIController {
  constructor(data) {
    super(data);

    this.onResized = this.onResized.bind(this);
    this.onUpdated = this.onUpdated.bind(this);
  }

  async init() {
    this.initEvents();
    await super.init();

    const spr = new global.PIXI.Sprite(global.PIXI.Texture.WHITE);
    spr.width = 100;
    spr.height = 100;
    this.stage.addChild(spr);
  }

  initEvents() {
    const {eventDispatcher} = this;

    eventSubscription({
      target: eventDispatcher,
      callbacksBus: [
        {event: RESIZE, callback: this.onResized},
        {event: UPDATED, callback: this.onUpdated}
      ]
    });
  }

  onResized() {

  }

  onUpdated({data: {ms, deltaTime}}) {
    super.onUpdated({data: {ms, deltaTime}});
  }
}