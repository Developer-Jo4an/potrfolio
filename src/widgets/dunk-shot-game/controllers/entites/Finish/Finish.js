import {BaseEntity} from "../base/BaseEntity";
import {PIXI_SPACE, TEXTURE, assetsManager} from "@shared";
import {FINISH} from "../../constants/preload";

export class Finish extends BaseEntity {
  constructor(data) {
    super(data);

    this.init();
  }

  init() {
    this.initView();
  }

  initView() {
    const {
      target,
      groups,
      storage: {
        mainSceneSettings: {
          finish: {width, height, offset},
        },
      },
    } = this;

    const view = (this.view ??= new PIXI.Sprite());
    view.label = "finish";
    groups.back.attach(view);
    view.texture = assetsManager.getAssetFromSpace(PIXI_SPACE, TEXTURE, FINISH);
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
