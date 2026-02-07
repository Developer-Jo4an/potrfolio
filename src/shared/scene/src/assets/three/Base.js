import {Asset} from "../Asset";
import {isObject} from "lodash";

export class Base extends Asset {
  create() {
    this.createAsset();
    const mergedData = this._getMergedData();
    this._setProperties(mergedData);
    return this.asset;
  }

  createAsset() {
    this.asset = new THREE.Object3D();
  }

  reset() {
    const {asset} = this;

    super.reset();

    asset.position.set(0, 0, 0);
    asset.rotation.set(0, 0, 0);
    asset.scale.set(1, 1, 1);

    asset.visible = true;

    asset.remove();
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
