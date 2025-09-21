import BaseWrapper from "../base/BaseWrapper";

export default class PixiWrapper extends BaseWrapper {
  constructor(data) {
    super(data);
  }

  get eventBus() {
    const {controller} = this;

    return controller?.eventBus;
  }

  initController() {

  }
}