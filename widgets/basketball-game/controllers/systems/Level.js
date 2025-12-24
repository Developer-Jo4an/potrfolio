import System from "../../../../shared/scene/ecs/core/System";
import Entity from "../../../../shared/scene/ecs/core/Entity";
import ThreeComponent from "../../../../shared/scene/ecs/three/components/ThreeComponent";
import Body from "../../../../shared/scene/ecs/rapier/components/Body";
import {mean} from "lodash";
import {CHARACTER, CHARACTER_BODY} from "../../entities/character";
import {GROUND, GROUND_BODY} from "../../entities/ground";
import {RING, RING_BODY} from "../../entities/ring";

export default class Level extends System {
  initializationLevelSelect() {
    this.initCharacter();
    this.initRing();
    this.initGround();
  }

  initCharacter() {
    const {
      eventBus, storage: {
        scene,
        mainSceneSettings: {
          character: {
            transparent,
            receiveShadow,
            castShadow,
            metalness,
            roughness,
            angularDamping,
            linearDamping,
            friction,
            restitution,
            startData: {rotation, position}
          }
        }
      }
    } = this;

    const eCharacter = new Entity({eventBus, type: CHARACTER}).init();

    const cThreeComponent = eCharacter.get(ThreeComponent);
    const characterView = cThreeComponent.threeObject = this.getAsset(eCharacter, CHARACTER);
    characterView.material.transparent = transparent;
    characterView.material.metalness = metalness;
    characterView.material.roughness = roughness;
    characterView.receiveShadow = receiveShadow;
    characterView.castShadow = castShadow;
    scene.add(characterView);

    const cBody = eCharacter.get(Body);
    const {geometry: {boundingBox: {min, max}}} = characterView;
    const radius = mean([max.x - min.x, max.y - min.y, max.z - min.z].map(num => Math.abs(num / 2)));
    const characterBody = cBody.object = this.getAsset(eCharacter, CHARACTER_BODY, {radius});
    characterBody.setTranslation(position);
    characterBody.setRotation(new THREE.Quaternion().setFromEuler(new THREE.Euler().setFromVector3(rotation)));
    characterBody.setBodyType(RAPIER3D.RigidBodyType.KinematicPositionBased);
    characterBody.setLinearDamping(linearDamping);
    characterBody.setAngularDamping(angularDamping);
    characterBody.collider.setRestitution(restitution);
    characterBody.collider.setFriction(friction);
    characterBody.collider.setActiveEvents(RAPIER3D.ActiveEvents.COLLISION_EVENTS);
  }

  initRing() {
    const {
      eventBus, storage: {
        scene,
        mainSceneSettings: {
          ring: {
            transparent,
            startData: {position}
          }
        }
      }
    } = this;

    const eRing = new Entity({eventBus, type: RING}).init();
    const cThreeComponent = eRing.get(ThreeComponent);
    const ringView = cThreeComponent.threeObject = this.getAsset(eRing, RING);
    ringView.material.transparent = transparent;
    scene.add(ringView);

    const cBody = eRing.get(Body);
    const vertices = Array.from(ringView.geometry.attributes.position.array);
    const indexes = Array.from(ringView.geometry.index.array);
    const groundBody = cBody.object = this.getAsset(eRing, RING_BODY, {vertices, indexes});
    groundBody.setTranslation(position);
    groundBody.collider.setActiveEvents(RAPIER3D.ActiveEvents.COLLISION_EVENTS);
  }

  initGround() {
    const {
      eventBus,
      storage: {scene, mainSceneSettings: {ground: {height, castShadow, friction, restitution, receiveShadow}}}
    } = this;

    const eGroud = new Entity({eventBus, type: GROUND}).init();

    const cThreeComponent = eGroud.get(ThreeComponent);
    const groundView = this.getAsset(eGroud, GROUND);
    groundView.name = GROUND;
    groundView.receiveShadow = receiveShadow;
    groundView.castShadow = castShadow;
    cThreeComponent.threeObject = groundView;
    scene.add(groundView);

    const eCharacter = this.getFirstEntityByType(CHARACTER);
    const cCharacterBody = eCharacter.get(Body);
    const characterBodyRadius = cCharacterBody.object.collider.shape.radius;
    const cBody = eGroud.get(Body);
    const vertices = Array.from(groundView.geometry.attributes.position.array);
    const indexes = Array.from(groundView.geometry.index.array);
    const groundBody = cBody.object = this.getAsset(eGroud, GROUND_BODY, {vertices, indexes});
    groundBody.setTranslation({x: 0, y: -height / 2 - characterBodyRadius, z: 0});
    groundBody.collider.setFriction(friction);
    groundBody.collider.setRestitution(restitution);
    groundBody.collider.setFrictionCombineRule(RAPIER3D.CoefficientCombineRule.Max);
    groundBody.collider.setRestitutionCombineRule(RAPIER3D.CoefficientCombineRule.Max);
    groundBody.collider.setActiveEvents(RAPIER3D.ActiveEvents.COLLISION_EVENTS);
  }

  update({deltaTime}) {
  }
}