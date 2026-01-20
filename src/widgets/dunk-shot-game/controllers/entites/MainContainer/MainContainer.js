import {BaseEntity} from "../base/BaseEntity";

export class MainContainer extends BaseEntity {
  constructor(data) {
    super(data);

    this.init();
  }

  init() {
    this.initView();
  }

  initView() {
    const view = (this.view ??= new PIXI.Container());
    view.label = "mainContainer";
    view.position.set(0, 0);
  }

  addToSpaces() {
    const {stage, view} = this;

    stage.addChild(view);
  }
}
