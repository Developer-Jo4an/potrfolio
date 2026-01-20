import {Ball} from "./Ball";

export class ShadowBall extends Ball {
  constructor(data) {
    super(data);
  }

  init() {
    super.initBody();
  }

  addToSpaces() {
    this.addToWorld();
  }
}
