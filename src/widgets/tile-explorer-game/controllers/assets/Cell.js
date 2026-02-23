import {labels} from "../constants/labels";
import {ids} from "../constants/ids";
import {CELL_BACKGROUND, TILE_EXPLORER} from "../constants/preload";
import {Container, assetsManager, PIXI_SPACE, SCENE, TEXTURE} from "@shared";

export class Cell extends Container {
  static types = {
    standard: "standard",
    explosion: "explosion",
    blocked: "blocked"
  };

  static assetsCache = {};

  createAsset() {
    this.asset = new PIXI.Container();

    this.getBackground();

    this.addSpineClip();
    this.addSpineClip(Cell.types.explosion);
    this.addSpineClip(Cell.types.blocked);
  }

  getBackground() {
    const {asset} = this;

    const texture = assetsManager.getAssetFromSpace(PIXI_SPACE, TEXTURE, CELL_BACKGROUND);
    const background = new PIXI.Sprite(texture);
    background.label = labels.cell.background;
    background.anchor.set(0.5);

    asset.addChild(background);
  }

  addSpineClip(assetType = Cell.types.standard) {
    const {asset} = this;
    const {type} = this._getMergedData();

    const cachedAsset = this.getSpineCachedClip(assetType);
    const assetConstructor = this.getSpineClipConstructor(assetType);

    const totalAsset = cachedAsset ?? assetConstructor();

    totalAsset.label = Cell.getSpineClipLabel(type, assetType);
    totalAsset.id = this.getSpineClipId(assetType);
    totalAsset.alpha = Number(assetType === Cell.types.standard);

    this.spineClipUpdateOnce(totalAsset);
    asset.addChild(totalAsset);
  }

  prepare() {
    super.prepare();

    this.addSpineClip();
    this.addSpineClip(Cell.types.explosion);
    this.addSpineClip(Cell.types.blocked);
  }

  reset() {
    this.resetBackground();

    this.resetSpineClip();
    this.resetSpineClip(Cell.types.explosion);
    this.resetSpineClip(Cell.types.blocked);

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

  resetSpineClip(assetType = Cell.types.standard) {
    const {type} = this._getMergedData();
    const label = Cell.getSpineClipLabel(type, assetType);
    const spineClip = this.asset.getChildByLabel(label);

    (Cell.assetsCache[spineClip.label] ??= []).push(spineClip);

    spineClip.state.clearTracks();
    spineClip.state.clearListeners();
    spineClip.skeleton.setToSetupPose();

    spineClip.scale.set(1);
    spineClip.alpha = Number(assetType === Cell.types.standard);
    spineClip.label = null;
    spineClip.id = null;

    spineClip.removeFromParent();

    this.spineClipUpdateOnce(spineClip);
  }

  static getSpineClipLabel(type, assetType = Cell.types.standard) {
    return {
      [Cell.types.standard]: type,
      [Cell.types.explosion]: `${type}_explosion`,
      [Cell.types.blocked]: "blocked"
    }[assetType];
  }

  getSpineClipId(assetType = Cell.types.standard) {
    return {
      [Cell.types.standard]: ids.cell.view,
      [Cell.types.explosion]: ids.cell.viewExplosion,
      [Cell.types.blocked]: ids.cell.blocked
    }[assetType];
  }

  getSpineClipConstructor(assetType = Cell.types.standard) {
    const {type} = this._getMergedData();
    const {animations} = assetsManager.getAssetFromSpace(PIXI_SPACE, SCENE, TILE_EXPLORER);

    const assetKey = {
      [Cell.types.standard]: `skeleton_Item_1_${type}`,
      [Cell.types.explosion]: `skeleton_Item_1_${type}_explosion`,
      [Cell.types.blocked]: "ice"
    }[assetType];

    return animations[assetKey];
  }

  getSpineCachedClip(assetType = Cell.types.standard) {
    const {type} = this._getMergedData();
    const label = Cell.getSpineClipLabel(type, assetType);
    const cachedAssets = Cell.assetsCache[label];
    const cachedAsset = cachedAssets?.[0];
    if (cachedAsset) cachedAssets?.shift();
    return cachedAsset;
  }

  spineClipUpdateOnce(spineCLip) {
    spineCLip.update(0);
  }
}

