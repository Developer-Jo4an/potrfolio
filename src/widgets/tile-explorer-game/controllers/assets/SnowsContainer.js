import {assetsManager, ParticleContainer, PIXI_SPACE, TEXTURE} from "@shared";
import {SNOW} from "../constants/preload";
import {labels} from "../constants/labels";

export class SnowsContainer extends ParticleContainer {
  create() {
    const {defaultProperties: {storage: {mainSceneSettings: {snow: {particles: {count}}}}}} = this;

    const texture = assetsManager.getAssetFromSpace(PIXI_SPACE, TEXTURE, SNOW);

    this.asset = new PIXI.ParticleContainer({
      texture,
      particles: Array.from({length: count}).map(() => {
        const particle = new PIXI.Particle(texture);
        particle.label = labels.snow.particle;
        particle.anchorX = 0.5;
        particle.anchorY = 0.5;
        return particle;
      }),
      dynamicProperties: {
        position: true,
        rotation: true,
        vertex: true,
        uvs: true,
        color: true
      }
    });
  }

  reset() {
    const {asset} = this;

    asset.particleChildren.forEach(particle => {
      particle.rotation = 0;
    });

    super.reset();
  }
}