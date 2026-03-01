import {assetsManager, PIXI_SPACE, SPRITESHEET, Spritesheet} from "@shared";

export class BaseCachedAsset extends Spritesheet {
  static ASSETS_NAME = "atlas";

  static cachedAssets = {};

  createAsset() {
    this.asset = this.getAsset();
    this.setProperties();
  }

  getAsset() {
    const {textureName} = this._getMergedData();
    const {cachedAssets} = BaseCachedAsset;

    const cachedList = (cachedAssets[textureName] ??= []);
    if (!!cachedList.length) return cachedList.pop();

    const {animations} = assetsManager.getAssetFromSpace(PIXI_SPACE, SPRITESHEET, this.constructor.ASSETS_NAME);
    return new PIXI.AnimatedSprite(animations[textureName]);
  }

  prepare() {
    this.asset = this.getAsset();
    this.setProperties();
    super.prepare();
  }

  reset() {
    const {asset} = this;
    const {cachedAssets} = BaseCachedAsset;
    (cachedAssets[asset.label] ??= []).push(asset);
    super.reset();
  }

  setProperties() {
    const {textureName, label, anchor, zIndex} = this._getMergedData();
    const {
      asset,
      defaultProperties: {
        storage: {
          mainSceneSettings: {
            clips: {[textureName]: {speed = 1, loop = false, startFrame = 0} = {}},
          },
        },
      },
    } = this;

    asset.zIndex = zIndex;
    asset.animationSpeed = speed;
    asset.loop = loop;
    asset.label = label;
    asset.anchor.set(anchor);
    asset.gotoAndStop(startFrame);
  }
}
