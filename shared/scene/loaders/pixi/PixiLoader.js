import BaseLoader from "../base/BaseLoader";
import {upperFirst} from "lodash";
import {assetsManager} from "../../assets/AssetsManager";
import {PIXI_SPACE, TEXTURE} from "../../constants/loaders/assetsTypes";

export default class PIXILoader extends BaseLoader {
  async init(dpr) {
    if (this.isInitialized) return;

    await PIXI.Assets.init({
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
    const texture = await PIXI.Assets.load({alias: name, src});
    assetsManager.setAssetsToSpace(PIXI_SPACE, TEXTURE, name, texture);
  }
}

export const pixiLoader = new PIXILoader();