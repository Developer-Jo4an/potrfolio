import {Container} from "./Container";

export class ParticleContainer extends Container {
  createAsset() {
    this.asset = new PIXI.ParticleContainer();
  }
}