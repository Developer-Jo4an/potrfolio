import {BaseDecorator} from "../base/BaseDecorator";
import {eventSubscription} from "../../../../lib";
import {RESIZE} from "../../../../constants";

export class Resize extends BaseDecorator {
  constructor(data) {
    super(data);

    this.onResized = this.onResized.bind(this);
  }

  initDecorator() {
    this.initEvents();
  }

  initEvents() {
    eventSubscription({callbacksBus: [{event: RESIZE, callback: this.onResized}]});
  }

  onResized(data) {
    const {eventBus} = this;

    eventBus.dispatchEvent({type: RESIZE, data});
  }
}
