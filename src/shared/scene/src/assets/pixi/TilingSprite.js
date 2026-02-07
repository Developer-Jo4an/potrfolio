import {Sprite} from "./Sprite";

export class TilingSprite extends Sprite {
  createAsset() {
    this.asset = new PIXI.TilingSprite();
  }

  reset() {
    super.reset();

    const {asset} = this;

    asset.tilePosition.set(0);
    asset.tileScale.set(1);
    asset.tileRotation = 0;
  }
}
