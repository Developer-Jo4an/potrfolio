import {BasePixiAsset} from "./BasePixiAsset";

export class Particle extends BasePixiAsset {
  createAsset() {
    this.asset = new PIXI.Particle();
  }
}