import BaseWrapper from "../base/BaseWrapper";

export default class PixiWrapper extends BaseWrapper {
  constructor(data) {
    super(data);
  }

  get eventDispatcher() {
    const {controller} = this;

    return controller?.eventDispatcher;
  }

  initController() {

  }
}