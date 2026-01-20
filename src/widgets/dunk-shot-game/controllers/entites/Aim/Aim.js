import {BaseEntity} from "../base/BaseEntity";
import {createArrayWithMap, assetsManager, PIXI_SPACE, TEXTURE} from "@shared";
import {dunkShotFactory} from "../../factory/DunkShotFactory";
import {AIM} from "../../../config/preload";

export class Aim extends BaseEntity {
  constructor(data) {
    super(data);

    this.init();
  }

  init() {
    this.initViews();
  }

  initViews() {
    const {
      groups,
      storage: {
        mainSceneSettings: {
          aim: {
            points: {count, size},
          },
        },
      },
    } = this;

    const views = (this.views ??= createArrayWithMap(count, (_, i, {length}) => {
      const view = new PIXI.Sprite();
      view.label = `aim:${i}`;
      view.texture = assetsManager.getAssetFromSpace(PIXI_SPACE, TEXTURE, AIM);
      view.scale.set(1);
      groups.front.attach(view);
      const scale = (size.min + ((size.max - size.min) * (length - i)) / length) / Math.min(view.width, view.height);
      view.scale.set(scale);
      view.anchor.set(0.5);
      return view;
    }));

    this.setProperties();
  }

  addToSpaces() {
    const {views} = this;
    const {mainContainer} = dunkShotFactory;
    views.forEach((view) => mainContainer.view.addChild(view));
  }

  setProperties(alpha = 0, positions = []) {
    const {views} = this;

    views.forEach((view, index) => {
      view.alpha = alpha;
      view.visible = !!alpha;
      const {x, y} = positions[index] ?? {x: 0, y: 0};
      view.position.set(x, y);
    });
  }

  delete() {
    const {views} = this;
    views.forEach((view) => view.parent.removeChild(view));
  }

  reset() {
    this.delete();
    this.setProperties();
  }

  activate() {
    this.initViews();
  }
}
