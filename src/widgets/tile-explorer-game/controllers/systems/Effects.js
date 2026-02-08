import {CatmullRomCurve3, System, Vector3} from "@shared";
import {GAME, GAME_SIZE} from "../../constants/game";
import {SNOWS_CONTAINER} from "../../constants/preload";

export class Effects extends System {
  initializationLevelSelect() {
    this.initSnowBackground();
  }

  initSnowBackground() {
    const {
      storage: {
        stage,
        mainSceneSettings: {
          snow: {particles: {count}}
        }
      }
    } = this;

    const {asset: snowsContainer} = this.getSnowParticleContainer();
    stage.addChild(snowsContainer);

    for (let index = 0; index < count; index++) {
      const currentParticle = snowsContainer.particleChildren[index];

      this.prepareSnowParticle(currentParticle);

      const curve = this.getSnowParticleCurve(index, count);

      const tween = this.getSnowParticleTween(currentParticle, curve, index);
      tween.progress(Math.random());
    }
  }

  getSnowParticleContainer() {
    const {factory} = this;

    const containerAsset = factory.getItem(SNOWS_CONTAINER);
    this.toFactory(containerAsset);

    return containerAsset;
  }

  prepareSnowParticle(currentParticle) {
    const {
      storage: {
        mainSceneSettings: {
          snow: {
            particles: {size}
          }
        }
      }
    } = this;

    const scale = Math.min(
      size / currentParticle.texture.width,
      size / currentParticle.texture.height
    );

    currentParticle.scaleX = scale;
    currentParticle.scaleY = scale;

    return currentParticle;
  }

  getSnowParticleCurve(index, length) {
    const {
      storage: {
        mainSceneSettings: {
          snow: {
            curveSettings: {pointsCount, closed, curviness, curveType, tension},
            particles: {size}
          }
        }
      }
    } = this;

    const startPosition = new Vector3(GAME_SIZE.width * ((index + 1) / length), -size / 2, 0);

    const points = [startPosition];

    for (let index = 0; index < pointsCount; index++) {
      const multiplier = this.getMultiplier(index);

      const shiftX = curviness * multiplier;
      const shiftY = (GAME_SIZE.height + size) * ((index + 1) / pointsCount);

      const x = startPosition.x + shiftX;
      const y = startPosition.y + shiftY;

      points.push(new Vector3(x, y, 0));
    }

    return new CatmullRomCurve3(points, closed, curveType, tension);
  }

  getSnowParticleTween(particle, curve, index) {
    const {
      storage: {
        mainSceneSettings: {
          snow: {
            tween: {duration, rotation, ease}
          }
        }
      }
    } = this;

    const particleTween = gsap.timeline({
      repeat: -1,
      onUpdate() {
        const progress = this.progress();
        const point = curve.getPointAt(progress);

        particle.x = point.x;
        particle.y = point.y;
      },
      onComplete() {
        particleTween.delete(GAME);
      }
    }).save(GAME);

    particleTween.to(
      particle,
      {
        rotation: rotation * this.getMultiplier(index),
        duration,
        ease
      }
    );

    return particleTween;
  }

  getMultiplier(index) {
    return !!(index % 2) ? 1 : -1;
  }

  toFactory(asset) {
    const {
      factory,
      storage: {
        serviceData: {clearFunctions}
      }
    } = this;

    clearFunctions.push(() => {
      factory.pushItem(asset);
    });
  }
}
