import {BaseLoader} from "../base/BaseLoader";
import {upperFirst} from "lodash";
import {assetsManager} from "../../assets/AssetsManager";
import {PIXI_SPACE, SCENE, TEXTURE} from "../../constants/loaders/assetsTypes";
import {PIXI_APP_CONFIG} from "@shared";

export class PIXILoader extends BaseLoader {
  _isInitialized;

  _initPromise;

  get isInitialized() {
    return this._isInitialized;
  }

  get initPromise() {
    return this._initPromise;
  }

  init() {
    if (this.initPromise) return this.initPromise;

    this._initPromise = PIXI.Assets.init({
      texturePreference: {resolution: PIXI_APP_CONFIG.resolution, format: ["png", "webp"]},
      preferences: {crossOrigin: "anonymous"}
    }).then(() => {
      this._isInitialized = true;
    });
  }

  loadAssets(assets) {
    return Promise.all(
      assets.map(({name, type, src}) => {
        return this[`load${upperFirst(type)}`](name, src);
      })
    );
  }

  async loadTexture(name, src) {
    const texture = await PIXI.Assets.load({alias: name, src});
    assetsManager.setAssetsToSpace(PIXI_SPACE, TEXTURE, name, texture);
  }

  async loadScene(name, {atlas: atlasSrc, skeletons}) {
    const loadedAliases = [];

    const atlasKey = `${name}Atlas`;
    PIXI.Assets.add({alias: atlasKey, src: atlasSrc});
    loadedAliases.push(atlasKey);

    for (const skeletonName in skeletons) {
      const skeletonSrc = skeletons[skeletonName];
      PIXI.Assets.add({alias: skeletonName, src: skeletonSrc});
      loadedAliases.push(skeletonName);
    }

    const loadedData = await PIXI.Assets.load(loadedAliases);

    const spineData = Object.keys(loadedData).reduce((acc, key) => {
      if (!skeletons[key]) return acc;
      acc[key] = () => PIXI.SPINE.Spine.from({skeleton: key, atlas: atlasKey});
      return acc;
    }, {});

    assetsManager.setAssetsToSpace(PIXI_SPACE, SCENE, name, spineData);
  }
}

export const pixiLoader = new PIXILoader();
