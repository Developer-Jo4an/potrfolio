import BaseDecorator from "../base/BaseDecorator";
import {eventSubscription} from "../../../lib/events/eventListener";
import {RESIZE} from "../../../constants/events/eventsNames";

export default class Resize extends BaseDecorator {
  constructor(data) {
    super(data);

    this.onResized = this.onResized.bind(this);
  }

  initDecorator() {
    this.initEvents();
  }

  initEvents() {
    eventSubscription({
      callbacksBus: [
        {event: RESIZE, callback: this.onResized}
      ]
    });
  }

  onResized(data) {
    const {controller: {eventDispatcher}} = this;

    eventDispatcher.dispatchEvent({type: RESIZE, data});
  }
}