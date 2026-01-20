import {BaseEntity} from "../base/BaseEntity";
import {LEFT, RIGHT, PIXI_SPACE, TEXTURE, assetsManager} from "@shared";
import {WING} from "../../../config/preload";

export class Wing extends BaseEntity {
  _side = RIGHT;

  constructor(data) {
    super(data);

    this.init();
  }

  get side() {
    return this._side;
  }

  set side(side) {
    const {view} = this;

    this._side = side;
    const multiplier = {[LEFT]: -1, [RIGHT]: 1}[side];

    view.scale.x = view.scale.x * multiplier;
  }

  init() {
    this.initView();
  }

  initView() {
    const {
      groups,
      storage: {
        mainSceneSettings: {
          wings: {
            view: {width, height},
          },
        },
      },
    } = this;

    const view = (this.view ??= new PIXI.Sprite());
    view.label = "wing";
    view.texture = assetsManager.getAssetFromSpace(PIXI_SPACE, TEXTURE, WING);
    groups.middle.attach(view);
    view.scale.set(1);
    view.alpha = 1;
    view.scale.set(Math.min(width / view.width, height / view.height));
    view.anchor.set(0, 0.5);
  }

  addToSpaces() {
    this.addToStage();
  }

  reset() {
    this.side = RIGHT;
  }

  activate() {
    this.initView();
  }
}
