import {Base} from "./Base";

export class Container extends Base {
  createAsset() {
    this.asset = new PIXI.Container();
  }
}
