import BaseLoader from "../base/BaseLoader";
import {upperFirst} from "lodash/string";
import {assetsManager} from "../../assets/AssetsManager";
import {PIXI_SPACE, TEXTURE} from "../../constants/loaders/assetsTypes";
import global from "../../../constants/global/global";

export default class PIXILoader extends BaseLoader {

  _isInitialized = false;

  get isInitialized() {
    return this._isInitialized;
  }

  set isInitialized(isInitialized) {
    this._isInitialized = isInitialized;
  }

  async init(dpr) {
    if (this.isInitialized) return;

    await global.PIXI.Assets.init({
      texturePreference: {resolution: dpr, format: ["png"]},
      preferences: {crossOrigin: "anonymous"}
    });

    this.isInitialized = true;
  }

  loadAssets(assets) {
    return Promise.all(assets.map(({name, type, src}) => {
      return this[`load${upperFirst(type)}`](name, src);
    }));
  }

  async loadTexture(name, src) {
    const texture = await global.PIXI.Assets.load({alias: name, src});
    assetsManager.setAssetsToSpace(PIXI_SPACE, TEXTURE, name, texture);
  }
}

export const pixiLoader = new PIXILoader();