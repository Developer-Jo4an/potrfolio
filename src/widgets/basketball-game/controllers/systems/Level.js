import {Mixer, System, Body, ThreeComponent, Entity, add} from "@shared";
import {getVerticesWithDeep} from "../../utils/getVerticesWithDeep";
import {mean} from "lodash";
import {CHARACTER, CHARACTER_BODY} from "../constants/character";
import {GROUND, GROUND_BODY} from "../constants/ground";
import {RING, RING_BODY, RING_SHIELD_VIEW_NAME, RING_VIEW_NAME} from "../constants/ring";

export class Level extends System {
  initializationLevelSelect() {
    this.initCharacter();
    this.initRing();
    this.initGround();
  }

  initCharacter() {
    const {
      eventBus,
      storage: {
        scene,
        mainSceneSettings: {
          character: {
            transparent,
            receiveShadow,
            castShadow,
            opacity,
            metalness,
            roughness,
            angularDamping,
            linearDamping,
            friction,
            restitution,
            startData: {rotation, position},
          },
        },
      },
    } = this;

    const eCharacter = new Entity({eventBus, type: CHARACTER}).init();

    const cThreeComponent = eCharacter.get(ThreeComponent);
    const characterView = (cThreeComponent.threeObject = this.getAsset(eCharacter, CHARACTER));
    characterView.material.transparent = transparent;
    characterView.material.metalness = metalness;
    characterView.material.roughness = roughness;
    characterView.material.opacity = opacity;
    characterView.receiveShadow = receiveShadow;
    characterView.castShadow = castShadow;
    this.addSideEffect({entity: eCharacter, effect: add, args: [scene, characterView]});

    const cBody = eCharacter.get(Body);
    const {
      geometry: {
        boundingBox: {min, max},
      },
    } = characterView;
    const radius = mean([max.x - min.x, max.y - min.y, max.z - min.z].map((num) => Math.abs(num / 2)));
    const characterBody = (cBody.object = this.getAsset(eCharacter, CHARACTER_BODY, {radius}));
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
      eventBus,
      storage: {
        scene,
        mainSceneSettings: {
          ring: {
            sensor,
            transparent,
            startData: {position},
          },
        },
      },
    } = this;

    const eRing = new Entity({eventBus, type: RING}).init();
    const cThreeComponent = eRing.get(ThreeComponent);

    const ringContainer = (cThreeComponent.threeObject = this.getAsset(eRing, RING));
    ringContainer.traverse((object) => {
      if (object.material) object.material.transparent = transparent;
    });
    this.addSideEffect({entity: eRing, effect: add, args: [scene, ringContainer]});

    const ringView = ringContainer.getObjectByName(RING_VIEW_NAME);

    const ringViewVertices = Array.from(ringView.geometry.attributes.position.array);
    const ringViewIndexes = Array.from(ringView.geometry.index.array);

    const shieldView = ringContainer.getObjectByName(RING_SHIELD_VIEW_NAME);
    const {vertices: shieldViewVertices, indexes: shieldViewIndexes} = getVerticesWithDeep(shieldView);

    const cBody = eRing.get(Body);
    const ringBody = (cBody.object = this.getAsset(eRing, RING_BODY, {
      ring: {
        view: ringView,
        vertices: ringViewVertices,
        indexes: ringViewIndexes,
      },
      shield: {view: shieldView, vertices: shieldViewVertices, indexes: shieldViewIndexes, extraProps: {}},
      sensor,
    }));

    ringBody.setTranslation(position);
    ringBody.collider.ring.setActiveEvents(RAPIER3D.ActiveEvents.COLLISION_EVENTS);
  }

  initGround() {
    const {
      eventBus,
      storage: {
        scene,
        mainSceneSettings: {
          ground: {height, castShadow, friction, restitution, receiveShadow},
        },
      },
    } = this;

    const eGroud = new Entity({eventBus, type: GROUND}).init();

    const cThreeComponent = eGroud.get(ThreeComponent);
    const groundView = this.getAsset(eGroud, GROUND);
    groundView.name = GROUND;
    groundView.receiveShadow = receiveShadow;
    groundView.castShadow = castShadow;
    cThreeComponent.threeObject = groundView;
    this.addSideEffect({entity: eGroud, effect: add, args: [scene, groundView]});

    const eCharacter = this.getFirstEntityByType(CHARACTER);
    const cCharacterBody = eCharacter.get(Body);
    const characterBodyRadius = cCharacterBody.object.collider.shape.radius;
    const cBody = eGroud.get(Body);
    const vertices = Array.from(groundView.geometry.attributes.position.array);
    const indexes = Array.from(groundView.geometry.index.array);
    const groundBody = (cBody.object = this.getAsset(eGroud, GROUND_BODY, {vertices, indexes}));
    groundBody.setTranslation({x: 0, y: -height / 2 - characterBodyRadius, z: 0});
    groundBody.collider.setFriction(friction);
    groundBody.collider.setRestitution(restitution);
    groundBody.collider.setFrictionCombineRule(RAPIER3D.CoefficientCombineRule.Max);
    groundBody.collider.setRestitutionCombineRule(RAPIER3D.CoefficientCombineRule.Average);
    groundBody.collider.setActiveEvents(RAPIER3D.ActiveEvents.COLLISION_EVENTS);
  }

  update({deltaTime}) {}
}
