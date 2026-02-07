import {isObject} from "lodash";
import {Asset} from "../Asset";

export class BasePixiAsset extends Asset {
  create() {
    this.createAsset();
    const mergedData = this._getMergedData();
    this._setProperties(mergedData);
    return this.asset;
  }

  createAsset() {
    this.asset = new PIXI.DisplayObject();
  }

  reset() {
    super.reset();

    const {asset} = this;

    asset.position.set(0);
    asset.scale.set(1);
    asset.rotation = 0;
    asset.skew.set(0);
    asset.zIndex = 0;
    asset.visible = true;
    asset.renderable = true;
    asset.alpha = 1;
    asset.eventMode = "passive";
    asset.cursor = null;
    // ?label, ?id
    asset.removeFromParent();

    return asset;
  }

  _setProperties(mergedData) {
    const {asset} = this;

    for (const key in mergedData) {
      const value = mergedData[key];

      if (isObject(asset[key])) {
        for (const field in value) asset[key][field] = value[field];
      } else {
        asset[key] = value;
      }
    }
  }
}
