import {labels} from "../constants/labels";
import {CAGE, SHELF} from "../constants/preload";
import {assetsManager, Container, PIXI_SPACE, TEXTURE} from "@shared";

export class Shelf extends Container {
  createAsset() {
    this.asset = new PIXI.Container();

    this.addBackground();
    this.addCages();
  }

  addBackground() {
    const {asset} = this;

    const texture = assetsManager.getAssetFromSpace(PIXI_SPACE, TEXTURE, SHELF);
    const background = new PIXI.Sprite(texture);
    background.label = labels.shelf.background;

    asset.addChild(background);
  }

  addCages() {
    const {
      asset,
      defaultProperties: {
        storage: {
          mainSceneSettings: {
            shelf: {cagesCount}
          }
        }
      }
    } = this;

    for (let i = 0; i < cagesCount; i++) {
      const texture = assetsManager.getAssetFromSpace(PIXI_SPACE, TEXTURE, CAGE)
      const cage = new PIXI.Sprite(texture);
      cage.label = labels.shelf.cage;
      asset.addChild(cage);
    }
  }

  /**
   * @warning
   * Не убирать пустую функцию, она переопределяет предка
   */
  prepare() {
  }

  reset() {
    const {asset} = this;

    asset.removeFromParent();

    asset.children.forEach(child => {
      child.scale.set(1);
      child.position.set(0);
    });
  }
}
