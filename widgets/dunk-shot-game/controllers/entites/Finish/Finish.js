import BaseEntity from "../base/BaseEntity";
import {PIXI_SPACE, TEXTURE} from "../../../../../shared/scene/constants/loaders/assetsTypes";
import {assetsManager} from "../../../../../shared/scene/assets/AssetsManager";
import global from "../../../../../shared/constants/global/global";

export default class Finish extends BaseEntity {
  constructor(data) {
    super(data);

    this.init();
  }

  init() {
    this.initView();
  }

  initView() {
    const {target, groups, storage: {mainSceneSettings: {finish: {width, height, offset}}}} = this;

    const view = this.view ??= new global.PIXI.Sprite();
    view.name = "finish";
    groups.back.attach(view)
    view.texture = assetsManager.getAssetFromSpace(PIXI_SPACE, TEXTURE, "finish");
    view.scale.set(1);
    view.anchor.set(0, 1);
    const scale = Math.min(width / view.width, height / view.height);
    view.scale.set(scale);
    view.position.set(target.view.x + offset.x, target.view.y + offset.y);
    view.alpha = 0;
  }

  addToSpaces() {
    this.addToStage();
  }

  delete() {
    const {view} = this;
    view.parent?.removeChild?.(view);
  }

  reset() {
    this.delete();
  }

  activate(data) {
    this.target = data.target;
    this.initView();
  }
}