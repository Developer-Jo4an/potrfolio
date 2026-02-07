import {BasePixiAsset} from "./BasePixiAsset";

export class Container extends BasePixiAsset {
  createAsset() {
    this.asset = new PIXI.Container();
  }
}
