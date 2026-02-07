import {Base} from "./Base";
import {isObject, upperFirst} from "lodash";
import {assetsManager} from "../AssetsManager";
import {TEXTURE, PIXI_SPACE} from "../../constants/loaders/assetsTypes";

export class Sprite extends Base {
  createAsset() {
    this.asset = new PIXI.Sprite();
  }

  reset() {
    super.reset();

    const {asset} = this;

    asset.anchor.set(0);
    asset.texture = null;
  }

  _setProperties(mergedData) {
    const {asset} = this;

    for (const key in mergedData) {
      const value = mergedData[key];

      const methodKey = `_set${upperFirst(key)}`;

      if (this[methodKey]) {
        this[methodKey](value);
      } else {
        if (isObject(asset[key])) {
          for (const field in value) {
            asset[key][field] = value[field];
          }
        } else {
          asset[key] = value;
        }
      }
    }
  }

  _setTexture(value) {
    this.asset.texture = assetsManager.getAssetFromSpace(PIXI_SPACE, TEXTURE, value);
  }
}
