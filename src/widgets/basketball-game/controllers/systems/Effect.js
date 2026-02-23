import {TEXTURE, THREE_SPACE, assetsManager, EventComponent, Body, System} from "@shared";
import {CHARACTER, TRAIL} from "../constants/character";
import {THROWN} from "../constants/events";

export class Effect extends System {
  characterTrailSystem;

  characterTrailRenderer;

  init() {
    const {
      storage: {scene},
    } = this;

    const {
      ParticleSystem,
      Gradient,
      ConstantValue,
      ConstantColor,
      Vector4,
      Vector3,
      PointEmitter,
      ColorOverLife,
      BatchedRenderer,
    } = Quarks;

    const characterTrailSystem = (this.characterTrailSystem = new ParticleSystem({
      duration: 1,
      looping: false,
      shape: new PointEmitter(),
      emissionOverTime: new ConstantValue(40),
      startLife: new ConstantValue(0.6),
      startSpeed: new ConstantValue(1),
      startSize: new ConstantValue(0.6),
      startColor: new ConstantColor(new Vector4(1, 1, 1, 0.1)),
      worldSpace: true,
      material: new THREE.MeshBasicMaterial({
        map: assetsManager.getAssetFromSpace(THREE_SPACE, TEXTURE, TRAIL),
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthTest: false,
      }),
      behaviors: [
        new ColorOverLife(
          new Gradient(
            [
              [new Vector3(1, 1, 1), 0.1],
              [new Vector3(1, 1, 1), 0],
            ],
            [
              [1, 0],
              [0, 1],
            ],
          ),
        ),
      ],
    }));
    characterTrailSystem.stop();
    scene.add(characterTrailSystem.emitter);

    const characterTrailRenderer = (this.characterTrailRenderer = new BatchedRenderer());
    characterTrailRenderer.addSystem(characterTrailSystem);
    scene.add(characterTrailRenderer);
  }

  updateCharacterTrail({eCharacter, deltaTime}) {
    const {characterTrailRenderer, characterTrailSystem} = this;
    characterTrailRenderer.update(deltaTime);

    const {x, y, z} = eCharacter.get(Body).object.translation();
    characterTrailSystem.emitter.position.set(x, y, z);
  }

  checkOnThrown({eCharacter}) {
    const cThrown = eCharacter.getSome(EventComponent, THROWN);
    if (!!cThrown.length) {
      const {characterTrailSystem} = this;
      characterTrailSystem.restart();
    }
  }

  update() {
    const eCharacter = this.getFirstEntityByType(CHARACTER);
    const fullProps = {eCharacter, ...arguments[0]};
    this.updateCharacterTrail(fullProps);
    this.checkOnThrown(fullProps);
  }

  reset() {
    const {characterTrailSystem} = this;
    characterTrailSystem.stop();
  }
}
