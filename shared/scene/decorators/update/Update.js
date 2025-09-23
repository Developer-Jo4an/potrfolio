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

    const deltaMS = milliseconds - (updateData.prevMilliseconds ?? milliseconds);
    const deltaTime = deltaMS / 1000;

    this.throwEvent({deltaMS, deltaTime});

    updateData.prevMilliseconds = milliseconds;
    updateData.frame = requestAnimationFrame(this.update);
  }

  throwEvent({deltaMS, deltaTime}) {
    const {eventBus} = this;

    eventBus.dispatchEvent({type: UPDATED, deltaMS, deltaTime});
  }
}