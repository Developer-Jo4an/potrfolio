import BaseDecorator from "../base/BaseDecorator";
import {UPDATED} from "../../constants/events/names";

export default class Update extends BaseDecorator {

  updateData = {prevMilliseconds: null, frame: null};

  constructor(data) {
    super(data);

    this.update = this.update.bind(this);
  }

  startUpdate() {
    const {updateData} = this;

    updateData.frame = requestAnimationFrame(this.update);
  }

  stopUpdate() {
    const {updateData} = this;

    cancelAnimationFrame(updateData.frame);
    updateData.frame = null;
    updateData.prevMilliseconds = null;
  }

  update(milliseconds) {
    const {updateData} = this;

    const ms = milliseconds - (updateData.prevMilliseconds ?? milliseconds);
    const deltaTime = ms / 1000;

    this.throwEvent(ms, deltaTime);

    updateData.prevMilliseconds = milliseconds;
    updateData.frame = requestAnimationFrame(this.update);
  }

  throwEvent(ms, deltaTime) {
    const {controller: {eventDispatcher}} = this;

    eventDispatcher.dispatchEvent({type: UPDATED, data: {ms, deltaTime}});
  }
}