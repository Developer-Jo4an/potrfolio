import BaseEntity from "../base/BaseEntity";
import global from "../../../../../shared/constants/global/global";

export default class MainContainer extends BaseEntity {
  constructor(data) {
    super(data);

    this.init();
  }

  init() {
    this.initView();
  }

  initView() {
    const view = this.view ??= new global.PIXI.Container();
    view.name = "mainContainer";
    view.position.set(0, 0);
  }

  addToSpaces() {
    const {stage, view} = this;

    stage.addChild(view);
  }
}