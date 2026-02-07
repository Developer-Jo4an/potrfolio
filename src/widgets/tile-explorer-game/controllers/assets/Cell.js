import {labels} from "../../constants/labels";
import {ids} from "../../constants/ids";
import {CELL_BACKGROUND, TILE_EXPLORER} from "../../constants/preload";
import {Container, assetsManager, PIXI_SPACE, SCENE, TEXTURE} from "@shared";

export class Cell extends Container {
  static assetsCache = {};

  createAsset() {
    this.asset = new PIXI.Container();

    this.getBackground();
    this.addSpineClip();
    this.addSpineClip(true);
  }

  getBackground() {
    const {asset} = this;

    const texture = assetsManager.getAssetFromSpace(PIXI_SPACE, TEXTURE, CELL_BACKGROUND);
    const background = new PIXI.Sprite(texture);
    background.label = labels.cell.background;
    background.anchor.set(0.5);

    asset.addChild(background);
  }

  addSpineClip(isExplosion = false) {
    const {asset} = this;
    const {type} = this._getMergedData();

    const cachedAsset = this.getSpineCachedClip(isExplosion);
    const assetConstructor = this.getSpineClipConstructor(isExplosion);

    const totalAsset = cachedAsset ?? assetConstructor();

    totalAsset.label = Cell.getSpineClipLabel(type, isExplosion);
    totalAsset.id = this.getSpineClipId(isExplosion);
    totalAsset.alpha = Number(!isExplosion);

    this.spineClipUpdateOnce(totalAsset);
    asset.addChild(totalAsset);
  }

  prepare() {
    super.prepare();

    this.addSpineClip();
    this.addSpineClip(true);
  }

  reset() {
    this.resetBackground();
    this.resetSpineClip();
    this.resetSpineClip(true);

    super.reset();
  }

  /**
   * helpers
   */
  resetBackground() {
    const {asset} = this;

    const background = asset.getChildByLabel(labels.cell.background);
    background.scale.set(1);
  }

  resetSpineClip(isExplosion = false) {
    const {type} = this._getMergedData();
    const label = Cell.getSpineClipLabel(type, isExplosion);
    const spineClip = this.asset.getChildByLabel(label);

    (Cell.assetsCache[spineClip.label] ??= []).push(spineClip);

    spineClip.state.clearTracks();
    spineClip.state.clearListeners();
    spineClip.skeleton.setToSetupPose();

    spineClip.scale.set(1);
    spineClip.alpha = Number(!isExplosion);
    spineClip.label = null;
    spineClip.id = null;

    spineClip.removeFromParent();

    this.spineClipUpdateOnce(spineClip);
  }

  static getSpineClipLabel(type, isExplosion = false) {
    return isExplosion ? `${type}_explosion` : type;
  }

  getSpineClipId(isExplosion) {
    return isExplosion ? ids.cell.viewExplosion : ids.cell.view;
  }

  getSpineClipConstructor(isExplosion) {
    const {type} = this._getMergedData();
    const {animations} = assetsManager.getAssetFromSpace(PIXI_SPACE, SCENE, TILE_EXPLORER);
    return animations[`skeleton_Item_1_${type}${isExplosion ? "_explosion" : ""}`];
  }

  getSpineCachedClip(isExplosion) {
    const {type} = this._getMergedData();
    const label = Cell.getSpineClipLabel(type, isExplosion);
    const cachedAssets = Cell.assetsCache[label];
    const cachedAsset = cachedAssets?.[0];
    if (cachedAsset) cachedAssets?.shift();
    return cachedAsset;
  }

  spineClipUpdateOnce(spineCLip) {
    spineCLip.update(0);
  }
}

