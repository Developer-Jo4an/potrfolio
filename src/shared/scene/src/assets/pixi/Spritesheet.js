import {Sprite} from "./Sprite";

export class Spritesheet extends Sprite {
  createAsset() {
    this.asset = new PIXI.AnimatedSprite();
  }

  reset() {
    const {asset} = this;

    asset.gotoAndStop(0);
    asset.animationSpeed = 1;

    const {texture} = asset;

    super.reset();

    asset.texture = texture;
  }
}
