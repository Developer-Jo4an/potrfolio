import Ball from "./Ball";

export default class ShadowBall extends Ball {

  constructor(data) {
    super(data);
  }

  init() {
    super.initBody();
  }

  addToSpaces() {
    const {body} = this;
    this.addToWorld(body);
  }
}
